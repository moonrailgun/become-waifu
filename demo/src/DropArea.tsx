import { useEffect, useState } from 'preact/hooks';
import { useAtom } from 'jotai';
import { droppedFilesAtom } from './state';
import { readFiles } from '../../src/utils/file';

export function DropArea() {
  const [isDragging, setIsDragging] = useState(false);
  const [, setDroppedFiles] = useAtom(droppedFilesAtom);

  useEffect(() => {
    document.body.addEventListener('dragenter', () => {
      setIsDragging(true);
    });
    document.body.addEventListener('dragleave', (e) => {
      setIsDragging(!!e.relatedTarget);
    });
  }, []);

  return (
    <div>
      {isDragging && (
        <div
          style={{ padding: 20 }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();

            setIsDragging(false);

            if (e.dataTransfer?.items.length) {
              readFiles(e.dataTransfer.items).then((files) => {
                setDroppedFiles(files);
              });
            }
          }}
        >
          拖动文件到此处
        </div>
      )}
    </div>
  );
}
