// import {
//     DndContext,
//     KeyboardSensor,
//     closestCenter,
//     useSensor,
//     useSensors,
//     PointerSensor,
//     useDroppable,
//     DragStartEvent,
//     DragOverEvent,
//     DragEndEvent,
//   } from "@dnd-kit/core";
//   import {
//     SortableContext,
//     arrayMove,
//     sortableKeyboardCoordinates,
//     useSortable,
//     verticalListSortingStrategy,
//   } from "@dnd-kit/sortable";
//   import {
//     type PropsWithChildren,
//     useState,
//     createContext,
//     useContext,
//     useEffect,
//     Fragment,
//   } from "react";
//   import { CSS } from "@dnd-kit/utilities";
//   import { v4 as uuidv4 } from "uuid";

//   import { ComponentContext, useComponentContext } from "./ComponentContext";
//   import type { NormalizedComponent, NormalizedType } from "../types/components";
//   import type { Sections, SectionId, Section } from "../types/sections";
//   import { ComponentFactory } from "./ComponentFactory";
//   import { typedKeys } from "../utils/common";
//   import { Toolstrip } from "../toolstrip";
//   import { useDraftContext } from "../DraftContext";
//   import { defaultProps, tooltips } from "../utils/normalize";
//   import { cn } from "~/utils";
//   import { BaseComponentType } from "~/modules/design/types";
//   import { Contact } from "../../design/baseComponents/Contact";

//   const { log } = console;

//   export type DndProviderProps = {
//     sections: Sections;
//     decorated?: boolean;
//     className?: string;
//   };

//   type CrudContextType = {
//     addComponent: (component: NormalizedComponent) => void;
//     removeComponent: (component: NormalizedComponent) => void;
//     toggleClassName: (component: NormalizedComponent, className: string) => void;
//     turnInto: (component: NormalizedComponent, type: NormalizedType) => void;
//   };

//   const CrudContext = createContext({} as CrudContextType);

//   export const useCrudContext = () => {
//     const context = useContext(CrudContext);
//     return context;
//   };

//   export const getSectionIdByComponentId = (
//     sections: Sections,
//     componentId: string
//   ) => {
//     if (componentId in sections) return componentId;

//     const sectionId = typedKeys(sections).find((id) => {
//       const section = sections[id];

//       if (!section) return null;

//       return section.components.find((c) => c.id === componentId);
//     });

//     return sectionId;
//   };

//   const getComponent = (type: BaseComponentType) => {
//     if (type === "contact") return <Contact />;
//   };

//   const SortableItem = (
//     props: PropsWithChildren<Pick<DndProviderProps, "decorated">>
//   ) => {
//     const { children, decorated } = props;
//     const c = useComponentContext();
//     const {
//       attributes,
//       listeners,
//       setNodeRef,
//       transform,
//       transition,
//       node,
//       isDragging,
//     } = useSortable({ id: c.id, data: c });

//     const style = {
//       transform: CSS.Translate.toString(transform),
//       transition,
//       width: "100%",
//       opacity: isDragging ? 0.5 : 1,
//     };

//     return (
//       <Toolstrip
//         dndRef={setNodeRef}
//         listeners={listeners}
//         node={node}
//         attributes={attributes}
//         style={style}
//         className={cn({
//           "relative pl-6": decorated,
//           "flex-center": c.type === "image",
//         })}
//       >
//         {decorated && (
//           <Fragment>
//             <div
//               id={`ball-${c.id}`}
//               className="absolute left-0 top-2 z-10 h-3 w-3 rounded-full border-2 border-solid !border-black bg-white"
//             />
//             <div className="absolute left-[.36rem] top-2 h-full w-[0.5px] bg-black" />
//           </Fragment>
//         )}
//         {children}
//       </Toolstrip>
//     );
//   };

//   const Section = (props: Section & Pick<DndProviderProps, "decorated">) => {
//     const { id, components, className, decorated } = props;
//     const { setNodeRef } = useDroppable({
//       id,
//     });

//     return (
//       <SortableContext
//         id={id}
//         items={components}
//         strategy={verticalListSortingStrategy}
//       >
//         <ul ref={setNodeRef} className={className}>
//           {components.map((c) => (
//             <ComponentContext.Provider key={c.id} value={c}>
//               <SortableItem decorated={decorated && !c.type.includes("heading")}>
//                 {["entries", "context"].includes(c.type) ? (
//                   <DndProvider {...(c.props as { sections: Sections })} />
//                 ) : (
//                   <ComponentFactory />
//                 )}
//               </SortableItem>
//             </ComponentContext.Provider>
//           ))}
//         </ul>
//       </SortableContext>
//     );
//   };

//   export const DndProvider = (props: DndProviderProps) => {
//     const { sections: initialSections, ...rest } = props;
//     const [sections, setSections] = useState(initialSections);
//     const [activeId, setActiveId] = useState<null | string>(null);
//     const { updateDesign } = useDraftContext();

//     const sensors = useSensors(
//       useSensor(PointerSensor),
//       useSensor(KeyboardSensor, {
//         coordinateGetter: sortableKeyboardCoordinates,
//       })
//     );

//     useEffect(updateDesign, [sections]);
//     /**
//      * Reset sections when user selects a new design
//      */
//     useEffect(() => setSections(initialSections), [initialSections]);

//     const addComponent = (component: NormalizedComponent) =>
//       setSections((prev) => {
//         const { sectionId } = component;
//         const section = prev[sectionId];
//         if (!section) return prev;

//         const newSections = { ...prev };

//         const index = section.components.findIndex(
//           (c) => c.id === activeId || c.id === component.id
//         );

//         newSections[sectionId]!.components = [
//           ...section.components.slice(0, index + 1),
//           {
//             ...component,
//             props: {
//               ...component.props,
//               ...defaultProps,
//               tooltip: tooltips[component.type],
//             },
//             id: uuidv4(),
//           },
//           ...section.components.slice(index + 1),
//         ];

//         return newSections;
//       });

//     const removeComponent = (component: NormalizedComponent) =>
//       setSections((prev) => {
//         const { sectionId } = component;
//         const section = prev[sectionId];
//         if (!section) return prev;

//         const newSections = { ...prev };
//         newSections[sectionId]!.components = section.components.filter(
//           (c) => c.id !== component.id
//         );

//         return newSections;
//       });

//     const toggleClassName = (
//       component: NormalizedComponent,
//       className: string
//     ) => {
//       setSections((prev) => {
//         const { sectionId } = component;
//         const section = prev[sectionId];
//         if (!section) return prev;

//         const newSections = { ...prev };
//         newSections[sectionId]!.components = section.components.map((c) => {
//           if (c.id === component.id) {
//             const newComponent = { ...c };
//             const newProps = { ...newComponent.props };
//             const classSet = new Set(
//               newProps.className ? newProps.className.split(" ") : []
//             );

//             if (classSet.has(className)) classSet.delete(className);
//             else classSet.add(className);

//             newProps.className = Array.from(classSet).join(" ");
//             newComponent.props = newProps;

//             return newComponent;
//           }
//           return c;
//         });

//         return newSections;
//       });
//     };

//     const turnInto = (component: NormalizedComponent, type: NormalizedType) => {
//       setSections((prev) => {
//         const { sectionId } = component;
//         const section = prev[sectionId];
//         if (!section) return prev;

//         const newSections = { ...prev };
//         newSections[sectionId]!.components = section.components.map((c) => {
//           if (c.id === component.id) {
//             return { ...c, type };
//           }
//           return c;
//         });

//         return newSections;
//       });
//     };

//     const handleDragStart = ({ active }: DragStartEvent) => {
//       setActiveId(active.id as string);
//     };

//     const handleDragOver = ({ active, over }: DragOverEvent) => {
//       const activeSectionId = getSectionIdByComponentId(
//         sections,
//         active.id as string
//       );
//       const overSectionId = getSectionIdByComponentId(
//         sections,
//         over?.id as string
//       );

//       if (
//         !activeSectionId ||
//         !overSectionId ||
//         activeSectionId === overSectionId
//       ) {
//         return;
//       }

//       setSections((prev) => {
//         const activeItems = prev[activeSectionId as SectionId]?.components;
//         const overItems = prev[overSectionId as SectionId]?.components;

//         if (!activeItems || !overItems) {
//           return prev;
//         }

//         const activeIndex = activeItems.findIndex(
//           (item) => item.id === active.id
//         );
//         const overIndex = overItems.findIndex((item) => item.id === over?.id);

//         const newSections = { ...prev };

//         // Remove the active item from its original section
//         newSections[activeSectionId as SectionId]!.components =
//           activeItems.filter((item) => item.id !== active.id);

//         // Insert the active item into the new section at the correct position
//         newSections[overSectionId as SectionId]!.components = [
//           ...overItems.slice(0, overIndex),
//           activeItems[activeIndex],
//           ...overItems.slice(overIndex),
//         ] as NormalizedComponent[];

//         // Update sectionId key of component
//         newSections[overSectionId as SectionId]!.components = newSections[
//           overSectionId as SectionId
//         ]!.components.map((c) => ({
//           ...c,
//           sectionId: overSectionId as SectionId,
//         }));

//         return newSections;
//       });
//     };

//     const handleDragEnd = ({ active, over }: DragEndEvent) => {
//       const activeSectionId = getSectionIdByComponentId(
//         sections,
//         active.id as string
//       );
//       const overSectionId = getSectionIdByComponentId(
//         sections,
//         over?.id as string
//       );

//       // const activeSectionId = active.data.current.sectionId;
//       // const overSectionId = over?.data.current.sectionId;

//       const outsideSortable = !activeSectionId || !overSectionId;
//       const isSameSection = activeSectionId === overSectionId;
//       const shouldAbort = outsideSortable || !isSameSection;

//       if (shouldAbort) return;

//       setSections((prev) => {
//         const activeItems = prev[activeSectionId as SectionId]?.components;
//         const overItems = prev[overSectionId as SectionId]?.components;

//         if (!activeItems || !overItems) {
//           return prev;
//         }

//         const activeIndex = activeItems.findIndex(
//           (item) => item.id === active.id
//         );
//         const overIndex = overItems.findIndex((item) => item.id === over?.id);

//         if (activeIndex !== overIndex) {
//           const newSections = { ...prev };

//           // Move the active item within its section to the new position
//           newSections[overSectionId as SectionId]!.components = arrayMove(
//             newSections[overSectionId as SectionId]!.components,
//             activeIndex,
//             overIndex
//           );

//           // Update sectionId key of component
//           newSections[overSectionId as SectionId]!.components = newSections[
//             overSectionId as SectionId
//           ]!.components.map((c) => ({
//             ...c,
//             sectionId: overSectionId as SectionId,
//           }));

//           return newSections;
//         }

//         return prev; // If nothing changed, return the current
//       });

//       setActiveId(null);
//     };

//     return (
//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCenter}
//         onDragStart={handleDragStart}
//         onDragOver={handleDragOver}
//         onDragEnd={handleDragEnd}
//       >
//         <CrudContext.Provider
//           value={{
//             addComponent,
//             removeComponent,
//             toggleClassName,
//             turnInto,
//           }}
//         >
//           {typedKeys(sections).map((sectionId) => (
//             <Section
//               key={sectionId as string}
//               {...rest}
//               {...sections[sectionId]!}
//             />
//           ))}
//         </CrudContext.Provider>
//       </DndContext>
//     );
//   };
