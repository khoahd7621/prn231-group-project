import { Modal } from "antd";

import { ContractDetail } from ".";
import { ContractModel } from "../models";

type Props = {
  data: (ContractModel & { key: number }) | null;
  setData: React.Dispatch<React.SetStateAction<(ContractModel & { key: number }) | null>>;
};

export const DetailModal = ({ data, setData }: Props) => {
  const handleCancel = () => {
    setData(null);
  };

  if (data === null) return null;

  return (
    <Modal
      title={"Contract detail"}
      open={data !== null}
      footer={null}
      onCancel={handleCancel}
      width={500}
    >
      <ContractDetail data={data} />
    </Modal>
  );
};
