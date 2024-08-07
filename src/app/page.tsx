"use client";

import Container from "../components/Container";
import { Button } from "../components/ui/button";
import Link from "next/link";

export default function Component() {
  return (
    <Container>
      <div className="flex flex-col gap-y-6">
        <h3>Easy listings, Fast payments!</h3>

        <Button size="sm" className="w-fit">
          <Link href="/user">Launch app</Link>
        </Button>
      </div>
    </Container>
  );
}
