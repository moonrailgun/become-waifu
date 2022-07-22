export async function readFiles(
  dataTransferItemList: DataTransferItemList
): Promise<File[]> {
  const entries: FileSystemEntry[] = [];

  for (let i = 0; i < dataTransferItemList.length; i++) {
    entries.push(dataTransferItemList[i].webkitGetAsEntry());
  }

  return readEntries(entries);
}

async function readEntries(entries: FileSystemEntry[]): Promise<File[]> {
  const files: File[] = [];

  await Promise.all(
    entries.map(async (entry) => {
      if (entry.isFile) {
        files.push(await readFileEntry(entry as FileSystemFileEntry));
      } else if (entry.isDirectory) {
        const subEntries = await readDirEntry(
          entry as FileSystemDirectoryEntry
        );

        files.push(...(await readEntries(subEntries)));
      }
    })
  );

  return files;
}

function readDirEntry(
  dirEntry: FileSystemDirectoryEntry
): Promise<FileSystemEntry[]> {
  return new Promise((resolve, reject) => {
    dirEntry.createReader().readEntries(resolve, reject);
  });
}

async function readFileEntry(fileEntry: FileSystemFileEntry): Promise<File> {
  const file = await new Promise<File>((resolve, reject) =>
    fileEntry.file(resolve, reject)
  );

  let relativePath = fileEntry.fullPath;

  // relative path should just be relative...
  if (relativePath.startsWith('/')) {
    relativePath = relativePath.slice(1);
  }

  // let's borrow this property...
  Object.defineProperty(file, 'webkitRelativePath', {
    value: relativePath,
  });

  return file;
}
