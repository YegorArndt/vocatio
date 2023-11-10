import type { Design } from "~/modules/draft/types";

const toggleCn = (classNames: string, newClassName: string) => {
  const classNamesArray = classNames.split(" ");

  const index = classNamesArray.findIndex((className) => {
    return className === newClassName;
  });

  if (index === -1) {
    classNamesArray.push(newClassName);
  } else {
    classNamesArray.splice(index, 1);
  }

  return classNamesArray.join(" ");
};

export const updateCn = (
  design: Design,
  componentId: string,
  newClassName: string,
  removePattern?: RegExp
) => {
  const { sections } = design;

  const newSections = {};

  Object.keys(sections).forEach((sectionId) => {
    const section = sections[sectionId];

    const components = section.components.map((component) => {
      if (component.id === componentId) {
        let { className } = component.props;

        if (removePattern && className) {
          const classNamesArray = className.split(" ");
          className = classNamesArray
            .filter((className) => {
              return !removePattern.test(className);
            })
            .join(" ");
        }

        return {
          ...component,
          props: {
            ...component.props,
            className: toggleCn(className || "", newClassName),
          },
        };
      }

      return component;
    });

    newSections[sectionId] = {
      ...section,
      components,
    };
  });

  return {
    ...design,
    sections: newSections,
  };
};

export const updateType = (
  design: Design,
  componentId: string,
  newType: "baseHeading" | "baseText" | "baseGroup"
) => {
  const { sections } = design;

  const newSections = {};

  Object.keys(sections).forEach((sectionId) => {
    const section = sections[sectionId];

    const components = section.components.map((component) => {
      if (component.id === componentId) {
        return {
          ...component,
          type: newType,
          props: {
            ...component.props,
            className: design[newType],
          },
        };
      }

      return component;
    });

    newSections[sectionId] = {
      ...section,
      components,
    };
  });

  return {
    ...design,
    sections: newSections,
  };
};
