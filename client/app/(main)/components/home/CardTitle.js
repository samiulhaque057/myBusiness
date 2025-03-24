import React from "react";

export default function CardTitle({ title }) {
  return (
    <h3 className="text-2xl font-semibold leading-none tracking-tight pb-4 text-center text-nowrap">
      {title}
    </h3>
  );
}
