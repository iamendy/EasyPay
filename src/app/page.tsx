"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import Container from "../components/Container";
import Link from "next/link";
import { useAccount } from "wagmi";
import { Stroke } from "@/icons";
import Image from "next/image";
import preview from "../../public/img/preview.png";
import { Button } from "../components/ui/button";

export default function Component() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  return (
    <Container>
      <div className="flex flex-col justify-center items-center">
        <section className="py-8 lg:py-8 px-4 lg:pt-10 lg:px-7 pb-16">
          <header className="flex flex-col gap-y-12 xl:max-w-[1080px] xl:mx-auto">
            <div className="flex flex-col ">
              <h1
                className="font-inter font-bold tracking-[-0.04em] leading-[1.2em] text-base-100 text-4xl text-center
           md:mx-auto lg:text-[56px] w-full"
              >
                <span className="relative inline-block">
                  Easy listings, <Stroke />
                </span>{" "}
                Fast payments!
              </h1>

              <p
                className="text-lg font-medium leading-[1.75em] text-center 
          md:w-[70%] md:mx-auto lg:w-[60%] lg:text-2xl mt-12"
              >
                Create links and Start accepting USDT right now!
              </p>

              <div className="flex items-center justify-center mt-4">
                {isConnected ? (
                  <Link
                    href="/user"
                    className="bg-yellow font-bold text-base-100 px-5 py-3 rounded-lg lg:px-9"
                  >
                    Launch App →
                  </Link>
                ) : (
                  <Button
                    variant={"outline"}
                    onClick={openConnectModal}
                    className="bg-yellow font-bold text-base-100 px-5 py-3 rounded-lg lg:px-9"
                  >
                    Connect wallet →
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-[60%]">
                <Image src={preview} alt="EasyPay preview" />
              </div>
            </div>
          </header>
        </section>
      </div>
    </Container>
  );
}
