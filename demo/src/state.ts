import { atom } from 'jotai';

export const droppedFilesAtom = atom<File[] | null>(null);
