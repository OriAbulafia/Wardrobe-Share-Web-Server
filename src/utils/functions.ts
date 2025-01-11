import fs from "fs";

export const isValidURL = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_: any) {
    return false;
  }
};

export const deleteFileFromPath = async (
    path: string | undefined
  ): Promise<boolean> => {
    if (!path || isValidURL(path)) {
      return true;
    }
    return new Promise((resolve, reject) => {
      fs.unlink(path, (err) => {
        if (err) {
          return resolve(false);
        }
        resolve(true);
      });
    });
  };
  