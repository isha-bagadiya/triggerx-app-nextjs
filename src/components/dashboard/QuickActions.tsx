"use client";
import React from "react";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";
import TopUpTgDialog from "./TopUpTgDialog";
import WithdrawTgDialog from "./WithdrawTgDialog";
import ManageSafeWalletsDialog from "./ManageSafeWalletsDialog";
import { Card } from "../ui/Card";
import { useWalletConnectionContext } from "@/contexts/WalletConnectionContext";
import { useRouter } from "next/navigation";
import AlertEmail from "./AlertEmail";
import { useAccount } from "wagmi";

export const QuickActions = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [stakeAmount, setStakeAmount] = React.useState("");
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = React.useState(false);
  const [withdrawAmount, setWithdrawAmount] = React.useState("");
  const [isManageSafeDialogOpen, setIsManageSafeDialogOpen] =
    React.useState(false);
  const { isConnected } = useWalletConnectionContext();
  const { address } = useAccount();

  const router = useRouter();

  return (
    <>
      <Card>
        <Typography variant="h2" color="white" align="left">
          Quick Actions
        </Typography>

        <div className="space-y-4 mt-5">
          <Button
            className="w-full"
            onClick={() => setIsDialogOpen(true)}
            disabled={!isConnected}
          >
            Top Up TG
          </Button>
          <Button
            className="w-full"
            onClick={() => setIsWithdrawDialogOpen(true)}
            disabled={!isConnected}
          >
            Withdraw TG
          </Button>
          <Button className="w-full" onClick={() => router.push("/")}>
            Create New Job
          </Button>
          <Button
            className="w-full"
            onClick={() => setIsManageSafeDialogOpen(true)}
            disabled={!isConnected}
          >
            Manage Safe Wallets
          </Button>
        </div>

        <TopUpTgDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          stakeAmount={stakeAmount}
          setStakeAmount={setStakeAmount}
          // accountBalance={accountBalance}
          // fetchTGBalance={fetchTGBalance}
        />
        <WithdrawTgDialog
          open={isWithdrawDialogOpen}
          onOpenChange={setIsWithdrawDialogOpen}
          withdrawAmount={withdrawAmount}
          setWithdrawAmount={setWithdrawAmount}
          // tgBalance={userBalance}
          // fetchTGBalance={fetchTGBalance}
        />
        <ManageSafeWalletsDialog
          open={isManageSafeDialogOpen}
          onOpenChange={setIsManageSafeDialogOpen}
        />
      </Card>
      <AlertEmail user_address={address || ""} />
    </>
  );
};
