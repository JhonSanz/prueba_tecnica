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

  return (
    <div>
      <Link href="/login">Login</Link>
      <div>
        <Table columns={columns} rows={data} />
      </div>

    </div>
  );
}
