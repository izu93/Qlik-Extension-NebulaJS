import { useLayout, useElement, useEffect } from "@nebula.js/stardust";
import properties from "./object-properties";
import data from "./data";
import ext from "./ext";

/**
 * Entrypoint for your sense visualization
 * @param {object} galaxy Contains global settings from the environment.
 * Useful for cases when stardust hooks are unavailable (ie: outside the component function)
 * @param {object} galaxy.anything Extra environment dependent options
 * @param {object=} galaxy.anything.sense Optional object only present within Sense,
 * see: https://qlik.dev/extend/build-extension/in-qlik-sense
 */
export default function supernova(galaxy) {
  return {
    qae: {
      properties,
      data,
    },
    ext: ext(galaxy),
    component() {
      const element = useElement();
      const layout = useLayout();
      console.log(useLayout());

      useEffect(() => {
        if (layout.qSelectionInfo.qInSelections) {
          // skip rendering when in selection mode
          return;
        }
        const hc = layout.qHyperCube;

        // headers
        const columns = [...hc.qDimensionInfo, ...hc.qMeasureInfo].map(
          (f) => f.qFallbackTitle
        );
        const header = `<thead><tr>${columns
          .map((c) => `<th>${c}</th>`)
          .join("")}</tr></thead>`;

        // rows
        const rows = hc.qDataPages[0].qMatrix
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${cell.qText}</td>`).join("")}</tr>`
          )
          .join("");

        // table
        const table = `<table>${header}<tbody>${rows}</tbody></table>`;

        // output
        element.innerHTML = table;
      }, [element, layout]);
    },
  };
}
