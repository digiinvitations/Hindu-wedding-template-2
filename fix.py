with open("src/lib/db.ts", "r") as f:
    code = f.read()

import re

# find the interface definition and replace the broken one
interface_str = """
interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  let authInfoObj = {};
  try {
    const auth = getAuth();
    authInfoObj = {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email
    };
  } catch (e) {
    console.warn("Auth not initialized, skipping auth info in error");
  }
  
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: authInfoObj,
    operationType,
    path
  };
  
  console.warn('[Firebase] Firestore Error Trace:', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}
"""

start_idx = code.find("interface FirestoreErrorInfo")
end_idx = code.find("export async function saveConfigToDb")

if start_idx != -1 and end_idx != -1:
    code = code[:start_idx] + interface_str + "\n" + code[end_idx:]
    with open("src/lib/db.ts", "w") as f:
        f.write(code)
    print("Fixed!")
else:
    print("Could not find boundaries")
