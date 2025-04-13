export async function tryCatch(asyncFn, operationName) {
  try {
    const data = await asyncFn();
    return { data, error: null };
  } catch (error) {
    if (operationName) {
      console.error(`Error in ${operationName}:`, error);
    }
    return { data: null, error };
  }
}

