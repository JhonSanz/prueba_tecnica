"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import Table from "@/components/table";
import Confirmation from "@/components/confirmation";
import InfractionsSummaryService from "@/app/services/summary";
import positionsOptions from "@/components/tableRowOptions";
import Modal from '@/components/modal';

export default function Home() {
  const [data, setData] = useState<Array<any>>([]);
  const columns = [
    { name: "id", field: "id" },
    { name: "oficial", field: "officer.name" },
    { name: "Fecha", field: "created_at" },
    { name: "Vehiculo", field: "vehicle.license_plate" },
    { name: "Comentarios", field: "comments" },
  ]

  async function getPositionsData(filters: object): Promise<any> {
    const positionService = new InfractionsSummaryService();
    const data = await positionService.get(filters);
    if (data.error) return { data: [] };
    return data.response;
  }

  useEffect(() => {
    async function fetchData() {
      const positions = await getPositionsData({ email: "p4@mail.com" });
      setData(positions.data)
    }
    fetchData();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalOption, setModalOption] = useState<any>(null);

  const rowOptions = [
    { icon: "pencil" },
    { icon: "scissors" },
    { icon: "trash3" },
  ]
  const performAction = (action: string, row: any) => {
    let formOption = null;
    switch (action) {
      // case "pencil":
      //   formOption = <UpdatePositionForm
      //     currentRow={row}
      //     assets={assets}
      //     setIsModalOpen={setIsModalOpen}
      //     currentPosition={row}
      //     updateInterface={updateInterface}
      //   />
      //   break;
      case "trash3":
        formOption = <Confirmation
          title="Delete position"
          description="Are you sure you want to delete this position? It will delete all the deals and the position."
          onConfirm={() => /*deletePosition(row.id)*/ console.log("world")} onCancel={() => setIsModalOpen(false)}
        />
        break;
      // case "scissors":
      //   formOption = <DealPositionForm
      //     setIsModalOpen={setIsModalOpen}
      //     currentPosition={row}
      //     updateInterface={updateInterface}
      //   />
      //   break;
      default:
        return;
    }
    if (formOption === null) return;
    setModalOption(formOption);
    setIsModalOpen(true);
  }

  const positionsOptionsMain = (row: any) => positionsOptions(row, rowOptions, performAction)

  return (
    <div>
      <Link href="/login">Login</Link>
      <div>
        <Table columns={columns} rows={data} rowOptions={positionsOptionsMain} />
      </div>
      <Modal
        isOpen={isModalOpen} setIsOpen={setIsModalOpen}
        children={modalOption}
      />
    </div>
  );
}
