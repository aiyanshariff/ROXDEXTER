import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  User,
  ConfirmationResult
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { CitizenUserProfile, MunicipalComplaint } from "../types";

// User's web app Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCz4rbtKLKkSQwVMsVkfHvmmqSEZODlsB0",
  authDomain: "waste-management-bb52d.firebaseapp.com",
  projectId: "waste-management-bb52d",
  storageBucket: "waste-management-bb52d.firebasestorage.app",
  messagingSenderId: "12666716912",
  appId: "1:12666716912:web:a1db2ff9a90505a06c7835"
};

// Initialize Firebase app safely (prevent duplicate initializations)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Configure reCAPTCHA for SMS Multi-Factor / Phone Authentication
 */
export const initRecaptchaVerifier = (
  containerId: string = "recaptcha-container"
): RecaptchaVerifier => {
  // Clear any existing window instance if needed
  if (typeof window !== "undefined") {
    const existing = (window as unknown as { recaptchaVerifier?: RecaptchaVerifier }).recaptchaVerifier;
    if (existing) {
      try {
        existing.clear();
      } catch (e) {
        console.warn("Cleared existing recaptcha verifier:", e);
      }
    }
  }

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: "normal", // 'normal' allows clear visual SMS captcha confirmation
    callback: () => {
      // reCAPTCHA solved - allow signInWithPhoneNumber
      console.log("reCAPTCHA solved for SMS verification.");
    },
    "expired-callback": () => {
      console.warn("reCAPTCHA expired. Please verify again.");
    }
  });

  if (typeof window !== "undefined") {
    (window as unknown as { recaptchaVerifier?: RecaptchaVerifier }).recaptchaVerifier = verifier;
  }

  return verifier;
};

/**
 * Send SMS OTP Code to Citizen's Phone Number
 */
export const sendPhoneSmsOtp = async (
  phoneNumber: string,
  appVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error: unknown) {
    console.error("Error sending SMS OTP:", error);
    throw error;
  }
};

/**
 * Verify SMS OTP Code & Complete MFA Sign In / Registration
 */
export const confirmPhoneSmsOtp = async (
  confirmationResult: ConfirmationResult,
  otpCode: string,
  additionalDetails?: { displayName?: string; email?: string }
): Promise<User> => {
  const userCredential = await confirmationResult.confirm(otpCode);
  const user = userCredential.user;

  // Persist / update citizen profile in Firestore
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  const profileData: CitizenUserProfile = {
    uid: user.uid,
    phoneNumber: user.phoneNumber || additionalDetails?.displayName || "Verified Citizen",
    displayName: additionalDetails?.displayName || (userSnap.exists() ? userSnap.data()?.displayName : "Concerned Citizen"),
    email: additionalDetails?.email || user.email || (userSnap.exists() ? userSnap.data()?.email : undefined),
    createdAt: userSnap.exists() ? userSnap.data()?.createdAt : new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    mfaVerified: true,
    role: "citizen"
  };

  await setDoc(userRef, profileData, { merge: true });
  return user;
};

/**
 * Fetch Citizen Profile from Firestore
 */
export const getCitizenProfile = async (uid: string): Promise<CitizenUserProfile | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data() as CitizenUserProfile;
    }
    return null;
  } catch (err) {
    console.error("Error getting user profile:", err);
    return null;
  }
};

/**
 * Save Municipal Complaint to Firestore (Public & Citizen Records)
 */
export const saveComplaintToFirestore = async (
  complaint: MunicipalComplaint,
  userId?: string
): Promise<string> => {
  try {
    const complaintData = {
      ...complaint,
      userId: userId || complaint.userId || "anonymous-citizen",
      status: complaint.status || "Registered",
      timestamp: Date.now(),
      createdAtIso: new Date().toISOString(),
      updatedAt: serverTimestamp()
    };

    // Save to top-level complaints collection
    const complaintsCol = collection(db, "complaints");
    const docRef = await addDoc(complaintsCol, complaintData);

    // Also link under user's private collection if authenticated
    if (userId) {
      try {
        const userComplaintRef = doc(db, "users", userId, "complaints", docRef.id);
        await setDoc(userComplaintRef, {
          ...complaintData,
          complaintDocId: docRef.id
        });
      } catch (e) {
        console.warn("Could not save to user subcollection:", e);
      }
    }

    return docRef.id;
  } catch (error) {
    console.error("Error saving complaint to Firestore:", error);
    throw error;
  }
};

/**
 * Listen to complaints filed by a citizen
 */
export const subscribeToCitizenComplaints = (
  userId: string,
  onUpdate: (complaints: MunicipalComplaint[]) => void
) => {
  try {
    const complaintsCol = collection(db, "complaints");
    const q = query(
      complaintsCol,
      where("userId", "==", userId)
    );

    return onSnapshot(q, (snapshot) => {
      const list: MunicipalComplaint[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          ...(data as MunicipalComplaint),
          firestoreDocId: docSnap.id
        });
      });
      // Sort client-side by timestamp descending
      list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      onUpdate(list);
    }, (error) => {
      console.warn("Firestore snapshot error:", error);
    });
  } catch (e) {
    console.warn("subscribeToCitizenComplaints error:", e);
    return () => {};
  }
};
