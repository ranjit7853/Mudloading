function calculateWeighingMaterial() {
  // Get the values from the form
  const vi = parseFloat(document.getElementById("initVol").value);
  const di = parseFloat(document.getElementById("initD").value);
  const df = parseFloat(document.getElementById("finD").value);
  const material = document.getElementById("myDropdown").value; // Get selected material

  // Define densities and maximum specific gravity caps
  const materialData = {
    BaSO4: { density: 4.18, maxSG: 2.4 }, // Baryte: Density and max final SG
    Hema: { density: 7.874, maxSG: 3.0 }, // Hematite: Density and max final SG
    CaCO3: { density: 2.72, maxSG: 1.44 }, // Calcium Carbonate: Density and max final SG
  };

  // Check if selected material exists in materialData
  if (!materialData[material]) {
    alert("Please select a weighing material.");
    return;
  }

  // Set density and maximum specific gravity
  const db = materialData[material].density;
  const maxSG = materialData[material].maxSG;

  // Validate input values
  if (isNaN(vi) || isNaN(di) || isNaN(df)) {
    alert("Please enter valid numeric values for all inputs.");
    return;
  }

  if (vi <= 0) {
    alert("Initial Mud Volume must be greater than 0.");
    return;
  }

  if (di <= 1 || df <= 1) {
    alert("Specific Gravity values must be greater than 1.");
    return;
  }

  if (df <= di) {
    alert(
      "Final Specific Gravity must be greater than Initial Specific Gravity."
    );
    return;
  }

  // Check if the final specific gravity exceeds the maximum allowed for the material
  if (df > maxSG) {
    alert(
      `For ${
        material === "BaSO4"
          ? "Baryte"
          : material === "Hema"
          ? "Hematite"
          : "Calcium Carbonate"
      }, the maximum allowed specific gravity is ${maxSG}.`
    );
    return;
  }

  // Calculations
  const wb_Nocontrol = (vi * (df - di)) / (1 - df / db);
  const vb_Nocontrol = (vi * (df - di)) / (db - df);
  const vf_Nocontrol = vi + vb_Nocontrol;

  const VolDis = (vi * (df - di)) / (db - di);
  const WB_Control = ((vi * (df - di)) / (db - di)) * db;

  // Display results
  document.getElementById("result").innerHTML = `
        <div> 
        <strong><p>Keeping the Volume Constant</p></strong>
        <p>Volume of Mud Discarded: ${VolDis.toFixed(2)} Cu.Mts</p>
        <p>Weight of ${
          material === "BaSO4"
            ? "Baryte"
            : material === "Hema"
            ? "Hematite"
            : "Calcium Carbonate"
        } Added: ${WB_Control.toFixed(2)} MTs</p>
        <strong><p>No Mud Discarded Before Loading</p></strong>
        <p>Weight of ${
          material === "BaSO4"
            ? "Baryte"
            : material === "Hema"
            ? "Hematite"
            : "Calcium Carbonate"
        } Required: ${wb_Nocontrol.toFixed(2)} MTs</p>
        <p>Final Mud Volume: ${vf_Nocontrol.toFixed(2)} Cu.Mts</p>
        </strong>
    `;
}
