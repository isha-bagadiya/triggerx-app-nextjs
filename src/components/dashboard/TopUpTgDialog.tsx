"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../common/Dailog";
import { InputField } from "../ui/InputField";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";
import { useStakeRegistry } from "@/hooks/useStakeRegistry";
import { ethers } from "ethers";
import toast from "react-hot-toast";

interface TopUpTgDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stakeAmount: string;
  setStakeAmount: (value: string) => void;
  accountBalance?: { formatted?: string };
  fetchTGBalance: () => Promise<void>;
}

const TopUpTgDialog: React.FC<TopUpTgDialogProps> = ({
  open,
  onOpenChange,
  stakeAmount,
  setStakeAmount,
  accountBalance,
  fetchTGBalance,
}) => {
  const { stakeRegistryAddress } = useStakeRegistry();
  const [isStaking, setIsStaking] = useState(false);

  // Wrapper to clear stakeAmount when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setStakeAmount("");
    }
    onOpenChange(open);
  };

  const handleStake = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.getNetwork();
      setIsStaking(true);
      const signer = await provider.getSigner();
      const stakingContract = new ethers.Contract(
        stakeRegistryAddress,
        [
          "function purchaseTG(uint256 amount) external payable returns (uint256)",
        ],
        signer,
      );

      const stakeAmountInWei = ethers.parseEther(stakeAmount.toString());
      if (stakeAmountInWei === BigInt(0)) {
        throw new Error("TG amount must be greater than zero.");
      }
      const tx = await stakingContract.purchaseTG(
        ethers.parseEther(stakeAmount.toString()),
        { value: ethers.parseEther(stakeAmount.toString()) },
      );
      await tx.wait();
      await fetchTGBalance();
      toast.success("Top Up TG successful!");
      onOpenChange(false);
      setStakeAmount("");
    } catch (error: unknown) {
      toast.error((error as Error).message || "Error Top Up TG");
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Typography variant="h3" color="white" align="left">
              Top Up TG
            </Typography>
          </DialogTitle>
          <DialogDescription>
            <Typography variant="body" color="gray" align="left">
              Exchange ETH to TG (Flue of your job) to automate jobs on TriggerX
              1 ETH = 1000 TG
            </Typography>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleStake} className="space-y-6 ">
          <div>
            <label className="block mb-2">
              <Typography variant="body" color="gray" align="left">
                Amount (TG)
              </Typography>
            </label>
            <InputField
              type="number"
              value={stakeAmount}
              onChange={setStakeAmount}
              placeholder="Enter TG amount"
              className="rounded-xl"
            />
            {stakeAmount && Number(stakeAmount) > 0 && (
              <div className="mt-3 p-3 bg-[#242323] rounded-xl flex flex-col">
                <Typography variant="body" color="gray" align="left">
                  Estimated ETH
                </Typography>
                <Typography
                  variant="h3"
                  color="white"
                  align="left"
                  className="mt-1 font-bold tracking-wider"
                >
                  {(Number(stakeAmount) / 1000).toFixed(6)}
                </Typography>
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="flex w-full gap-3">
              <Button
                type="button"
                color="white"
                className="w-full"
                onClick={() => handleOpenChange(false)}
                disabled={isStaking || !!stakeAmount}
              >
                Cancel
              </Button>
              <Button
                color="purple"
                type="submit"
                disabled={
                  isStaking ||
                  !stakeAmount ||
                  Number(stakeAmount) > Number(accountBalance?.formatted || 0)
                }
                className="w-full"
              >
                {isStaking
                  ? "Topping Up..."
                  : Number(stakeAmount) > Number(accountBalance?.formatted || 0)
                    ? "Insufficient ETH"
                    : "Top Up TG"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TopUpTgDialog;
