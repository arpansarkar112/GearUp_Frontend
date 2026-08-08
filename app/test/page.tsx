"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export default function TestPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="p-10 bg-white min-h-screen">
      <h1 className="text-2xl text-black">Test Calendar</h1>
      <p className="text-black">Selected: {date?.toISOString()}</p>
      <div className="border inline-block p-4 mt-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate as any}
        />
      </div>
    </div>
  );
}
