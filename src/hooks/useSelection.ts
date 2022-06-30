import { useEffect, useState } from "react";
import SelectionArea, { SelectionEvent } from "@components/Vanilla";
import { Item } from "@libs/vdir/types";

const selection = new SelectionArea({
  selectables: [".main-grid__cell-inner"],
  boundaries: [".main-grid"]
});

const useSelection = (items: Item[]) => {
  const [fileIds, setFileIds] = useState<string[]>([]);

  const clear = () => {
    setFileIds([]);
    selection.getSelection().forEach(el => el.classList.remove("selected"));
    selection.clearSelection();
  };
  const selectAll = () => {
    setFileIds(items.map(v => v.shortId));
    selection.select([".ant-table-row", ".main-grid__cell-inner"]);
    selection._keepSelection();
    selection.getSelection().map(el => el.classList.add("selected"));
  };

  const selectionStart = () => { };
  const selectionMove = ({
    store: {
      changed: {
        removed,
        added
      }
    },
    event: oe
  }: SelectionEvent) => {
    if ((oe as any).button !== 2) {
      added.forEach(el => {
        const rowKey = el.getAttribute("data-row-key") || "";
        setFileIds(f => f.concat(rowKey));
        el.classList.add("selected");
      });
      removed.forEach(el => {
        const rowKey = el.getAttribute("data-row-key") || "";
        setFileIds(f => {
          const index = f.findIndex(i => i === rowKey);
          f.splice(index, 1);
          return f.slice(0);
        });
        el.classList.remove("selected");
      });
    }
  };
  const selectionStop = () => {
    selection._keepSelection();
  };

  useEffect(() => {
    selection.on("start", selectionStart);
    selection.on("move", selectionMove);
    selection.on("stop", selectionStop);

    return () => {
      selection.off("start", selectionStart);
      selection.off("move", selectionMove);
      selection.off("stop", selectionStop);
    };
  }, []);
  return { fileIds, selectAll, clear };
};

export default useSelection;