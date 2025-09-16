import { useState } from 'react';
import { useAccount, useConfig } from 'wagmi';
import { writeContract } from 'wagmi/actions';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/blockchainConfig';
import { toast } from '@/components/ui/sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const Settings = () => {
  const [bindAddress, setBindAddress] = useState("");
  const [okxId, setOkxId] = useState("");
  const [bitgetId, setBitgetId] = useState("");
  const [bybitId, setBybitId] = useState("");

  const { address } = useAccount();
  const config = useConfig();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!address) {
      toast.error('Wallet not connected');
      return;
    }
    setIsSaving(true);
    try {
      await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'setUserCexInfo',
        args: [bindAddress, okxId, bitgetId, bybitId],
        account: address,
        chain: config.chains[0],
      });
      toast.success('Bind info saved to blockchain!');
    } catch (e) {
      toast.error('Failed to save bind info');
    }
    setIsSaving(false);
  };

  return (
    <Card className="p-6 max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Bind Address & CEX UID</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bindAddress">Bind Address</Label>
          <Input
            id="bindAddress"
            value={bindAddress}
            onChange={e => setBindAddress(e.target.value)}
            placeholder="Enter your bind address (optional)"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="okxId">OKX UID</Label>
            <Input
              id="okxId"
              value={okxId}
              onChange={e => setOkxId(e.target.value)}
              placeholder="OKX UID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bitgetId">Bitget UID</Label>
            <Input
              id="bitgetId"
              value={bitgetId}
              onChange={e => setBitgetId(e.target.value)}
              placeholder="Bitget UID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bybitId">Bybit UID</Label>
            <Input
              id="bybitId"
              value={bybitId}
              onChange={e => setBybitId(e.target.value)}
              placeholder="Bybit UID"
            />
          </div>
        </div>
        <Button className="mt-4 w-full" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Bind Info'}
        </Button>
      </div>
    </Card>
  );
};
