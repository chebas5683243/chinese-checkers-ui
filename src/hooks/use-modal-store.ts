import { create } from "zustand";

export type CreateGameModalProps = {
  modalType: "createGame";
  data?: {};
};

export type ModalProps = CreateGameModalProps;
export type ModalType = ModalProps["modalType"] | null;
export type ModalData = ModalProps["data"] | null;

interface ModalStore {
  type: ModalType;
  data: ModalData;
  isOpen: boolean;
  onOpen: (props: ModalProps) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: null,
  isOpen: false,
  onOpen: (props) =>
    set({ type: props.modalType, data: props.data, isOpen: true }),
  onClose: () => set({ type: null, isOpen: false, data: null }),
}));
