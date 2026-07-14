"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";

interface SizeGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: string;
}

export function SizeGuideDialog({ open, onOpenChange, category }: SizeGuideProps) {
  const isPants = category === "pants" || category === "lowers" || category === "shorts";
  const isWomensEthnic = category === "lehenga" || category === "cotton-sets" || category === "chudidar";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md font-body">
        <DialogHeader>
          <DialogTitle>Size Guide ({category.toUpperCase()})</DialogTitle>
          <DialogDescription>
            Measurements are reference measurements. Product fit may vary by style and fabric.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <table className="w-full text-xs text-left border-collapse border border-border-light">
            <thead>
              <tr className="bg-bg-secondary text-text-primary font-heading font-bold">
                <th className="border border-border-light p-2">Size</th>
                {isPants ? (
                  <>
                    <th className="border border-border-light p-2">Waist (in)</th>
                    <th className="border border-border-light p-2">Hip (in)</th>
                    <th className="border border-border-light p-2">Length (in)</th>
                  </>
                ) : (
                  <>
                    <th className="border border-border-light p-2">Chest/Bust (in)</th>
                    <th className="border border-border-light p-2">Shoulder (in)</th>
                    <th className="border border-border-light p-2">Length (in)</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {isPants ? (
                <>
                  <tr>
                    <td className="border border-border-light p-2 font-bold font-heading">30</td>
                    <td className="border border-border-light p-2">30"</td>
                    <td className="border border-border-light p-2">38"</td>
                    <td className="border border-border-light p-2">40"</td>
                  </tr>
                  <tr>
                    <td className="border border-border-light p-2 font-bold font-heading">32</td>
                    <td className="border border-border-light p-2">32"</td>
                    <td className="border border-border-light p-2">40"</td>
                    <td className="border border-border-light p-2">41"</td>
                  </tr>
                  <tr>
                    <td className="border border-border-light p-2 font-bold font-heading">34</td>
                    <td className="border border-border-light p-2">34"</td>
                    <td className="border border-border-light p-2">42"</td>
                    <td className="border border-border-light p-2">41.5"</td>
                  </tr>
                  <tr>
                    <td className="border border-border-light p-2 font-bold font-heading">36</td>
                    <td className="border border-border-light p-2">36"</td>
                    <td className="border border-border-light p-2">44"</td>
                    <td className="border border-border-light p-2">42"</td>
                  </tr>
                </>
              ) : (
                <>
                  <tr>
                    <td className="border border-border-light p-2 font-bold font-heading">S</td>
                    <td className="border border-border-light p-2">38"</td>
                    <td className="border border-border-light p-2">17"</td>
                    <td className="border border-border-light p-2">28"</td>
                  </tr>
                  <tr>
                    <td className="border border-border-light p-2 font-bold font-heading">M</td>
                    <td className="border border-border-light p-2">40"</td>
                    <td className="border border-border-light p-2">18"</td>
                    <td className="border border-border-light p-2">29"</td>
                  </tr>
                  <tr>
                    <td className="border border-border-light p-2 font-bold font-heading">L</td>
                    <td className="border border-border-light p-2">42"</td>
                    <td className="border border-border-light p-2">18.5"</td>
                    <td className="border border-border-light p-2">30"</td>
                  </tr>
                  <tr>
                    <td className="border border-border-light p-2 font-bold font-heading">XL</td>
                    <td className="border border-border-light p-2">44"</td>
                    <td className="border border-border-light p-2">19"</td>
                    <td className="border border-border-light p-2">31"</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
          <p className="text-[10px] text-text-muted">
            *All dimensions are provided in inches. Standard size variants are optimized for regular fit. If you prefer a loose fit, we recommend ordering one size larger.
          </p>
        </div>
        <div className="flex justify-end border-t border-border-light pt-4">
          <Button onClick={() => onOpenChange(false)}>Close Guide</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
