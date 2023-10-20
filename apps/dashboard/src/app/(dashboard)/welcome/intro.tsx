"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Balancer } from "react-wrap-balancer";

import { AppRoutes } from "@acme/lib/routes";
import { buttonVariants } from "@acme/ui/components/button";
import { useDebounce } from "@acme/ui/hooks/use-debounce";

import { env } from "~/env.mjs";

export function Intro() {
  const showText = useDebounce(true, 800);

  return (
    <motion.div
      className="flex h-full w-full flex-col items-center justify-center"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      {showText && (
        <motion.div
          variants={{
            show: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="mx-5 flex flex-col items-center space-y-6 text-center sm:mx-auto"
        >
          <motion.h1
            className="text-4xl font-bold transition-colors sm:text-5xl"
            variants={{
              hidden: { opacity: 0, y: 50 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, type: "spring" },
              },
            }}
          >
            <Balancer>Welcome to {env.NEXT_PUBLIC_APP_NAME}</Balancer>
          </motion.h1>
          <motion.p
            className="max-w-md text-muted-foreground transition-colors sm:text-lg"
            variants={{
              hidden: { opacity: 0, y: 50 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, type: "spring" },
              },
            }}
          >
            {env.NEXT_PUBLIC_APP_DESCRIPTION}
          </motion.p>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 50 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, type: "spring" },
              },
            }}
          >
            <Link
              href={AppRoutes.WelcomeStepCreateProject}
              className={buttonVariants({
                size: "lg",
              })}
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
