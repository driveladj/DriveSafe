
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Creates a new Firebase Auth user (login with phone number) and a corresponding user document in Firestore.
 * Phone number is the primary identifier for login.
 * Email is optional additional data.
 */
exports.createTrainee = functions.https.onCall(async (data, context) => {
  // 1. Authentication and Authorization Check
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
  }
  const adminUser = await admin.auth().getUser(context.auth.uid);
  if (adminUser.customClaims?.role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Only admins can create new trainees.");
  }

  // 2. Destructure and Validate Input Data
  const {
    phone, // Mandatory
    password,
    firstNameAr,
    lastNameAr,
    firstNameEn,
    lastNameEn,
    dateOfBirth,
    placeOfBirth,
    licenseType,
    email, // Optional
  } = data;

  // Phone number and password are now the critical fields for auth creation
  if (!phone || !password || !firstNameAr || !lastNameAr || !firstNameEn || !lastNameEn || !licenseType || !dateOfBirth || !placeOfBirth) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required fields. Phone number, password, names, license type, date and place of birth are mandatory.");
  }

  // 3. Prepare the payload for Firebase Auth creation
  const userAuthPayload = {
      phoneNumber: phone,
      password: password,
      displayName: `${firstNameAr} ${lastNameAr}`,
  };

  // Add email to the auth payload only if it's provided
  if (email && email.trim() !== '') {
      userAuthPayload.email = email;
  }

  try {
    // 4. Create Firebase Authentication User
    const userRecord = await admin.auth().createUser(userAuthPayload);

    // 5. Set custom claims (role) for the new user
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: "user" });

    // 6. Create Firestore Document for the user
    await admin.firestore().collection("users").doc(userRecord.uid).set({
      firstNameAr,
      lastNameAr,
      firstNameEn,
      lastNameEn,
      dateOfBirth,
      placeOfBirth,
      phone: phone, // Mandatory phone number
      email: email || "", // Optional email
      licenseType,
      role: "user",
      status: "مؤكد",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      totalAmount: 0,
      paidAmount: 0,
    });
    
    functions.logger.log(`Successfully created new trainee ${userRecord.uid} by admin ${context.auth.uid}`);

    // 7. Return Success Response
    return { result: `Successfully created trainee ${userRecord.uid}. Login is with phone number.` };

  } catch (error) {
    functions.logger.error("Error creating new trainee:", error);
    if (error.code === 'auth/phone-number-already-exists') {
         throw new functions.https.HttpsError("already-exists", "رقم الهاتف هذا مستخدم بالفعل من قبل حساب آخر.");
    }
    if (error.code === 'auth/email-already-exists') {
         throw new functions.https.HttpsError("already-exists", "البريد الإلكتروني هذا مستخدم بالفعل من قبل حساب آخر.");
    }
    throw new functions.https.HttpsError("internal", "An error occurred while creating the trainee.");
  }
});


/**
 * Updates a trainee's own profile information in Firestore.
 */
exports.updateTraineeProfile = functions.https.onCall(async (data, context) => {
  // 1. Authentication Check: Make sure the user is authenticated.
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
  }

  const uid = context.auth.uid;

  // 2. Destructure and Validate Input Data
  const {
    firstNameAr,
    lastNameAr,
    firstNameEn,
    lastNameEn,
    dateOfBirth,
    placeOfBirth,
  } = data;

  if (!firstNameAr || !lastNameAr || !firstNameEn || !lastNameEn || !dateOfBirth || !placeOfBirth) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required fields. All name fields, date of birth, and place of birth are mandatory.");
  }

  try {
    // 3. Update Firestore Document
    const userDocRef = admin.firestore().collection("users").doc(uid);
    
    await userDocRef.update({
      firstNameAr,
      lastNameAr,
      firstNameEn,
      lastNameEn,
      dateOfBirth,
      placeOfBirth,
    });

    // 4. Update display name in Firebase Auth
    await admin.auth().updateUser(uid, {
        displayName: `${firstNameAr} ${lastNameAr}`,
    });

    functions.logger.log(`Successfully updated profile for trainee ${uid}`);

    // 5. Return Success Response
    return { result: `Successfully updated profile for trainee ${uid}.` };

  } catch (error) {
    functions.logger.error(`Error updating profile for trainee ${uid}:`, error);
    throw new functions.https.HttpsError("internal", "An error occurred while updating the profile.");
  }
});
