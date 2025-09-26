'use client';
import CardProps from "@/props/prop";

export default function Cards(props: CardProps) {
  return (
    <div className="border-light">{props.children}</div>
  );
}