'use client'
import { useEffect } from "react";

export default function PlaygroundPage() {
  useEffect(() => {
    const numbers = [1, 2, 3, 4, 5];
    console.log(numbers);
    console.log(numbers[0]);
  }, []);

  return <div>Check your browser console!</div>;
}
