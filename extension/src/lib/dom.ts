export const copyClasses = (
  sourceElement: HTMLElement,
  destinationElement: HTMLElement,
) => {
  sourceElement.classList.forEach((className) => {
    destinationElement.classList.add(className);
  });
};
