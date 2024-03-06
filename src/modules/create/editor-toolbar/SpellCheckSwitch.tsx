// import { useEffect, useState } from "react";
// import { Switch } from "~/components/ui/external/Switch";
// import { useSettings } from "~/hooks/useSettings";

// export const SpellCheckSwitch = () => {
//   const { ls, updateLs } = useSettings();
//   const [isSpellCheck, setter] = useState(false);

//   useEffect(() => {
//     if (ls.spellCheck === null) return;
//     setter(ls.spellCheck);
//   }, [ls.shouldAutoApplied]);

//   const onClick = () => {
//     setter(!isSpellCheck);
//     updateLs({ spellCheck: !isSpellCheck });
//   };

//   return (
//     <label className="flex-y max-w-[230px] gap-2">
//       <Switch checked={isSpellCheck} onClick={onClick} />
//       Spell check
//     </label>
//   );
// };
