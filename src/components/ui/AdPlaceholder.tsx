
export function AdPlaceholder() {
  return (
    <div className="mx-4 my-6 bg-card border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-2">
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-0.5 rounded">Sponsored</div>
      <h4 className="font-semibold text-sm">Experience StatusKeeper Pro</h4>
      <p className="text-xs text-muted-foreground max-w-[200px]">
        Remove all ads and get unlimited storage with our premium plan.
      </p>
      <div className="w-full h-32 bg-secondary/30 rounded-xl mt-4 flex items-center justify-center">
        <p className="text-xs italic text-muted-foreground/50">Advertisement Area</p>
      </div>
    </div>
  );
}
