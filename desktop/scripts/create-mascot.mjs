// Original vector artwork. Regenerate scene.rml, then compile with the Rive CLI.
import { writeFile } from "node:fs/promises";
const ink = "FF244C40",
  coat = "FF86B99D",
  light = "FFDCECDD",
  mane = "FF41675A",
  pink = "FFDDAF9F";
function shape(
  name,
  x,
  y,
  w,
  h,
  color,
  { rect = false, rotation = 0, id = "", radius = 8 } = {},
) {
  return `<Shape name="${name}" x="${x}" y="${y}" rotation="${rotation}" ${id ? `id="0:${id}"` : ""}><${rect ? "Rectangle" : "Ellipse"} width="${w}" height="${h}" originX="0.5" originY="0.5" ${rect ? `cornerRadiusTL="${radius}"` : ""}/><Fill><SolidColor colorValue="${color}"/></Fill></Shape>`;
}
function key(id, property, value) {
  return `<KeyedObject objectId="0:${id}"><KeyedProperty propertyKey="${property}"><KeyFrameDouble value="${value}"/></KeyedProperty></KeyedObject>`;
}
// An arm has three local pivots: shoulder, elbow, wrist. Both arm segments
// point down at 0 degrees; the palm's fingers point up at wrist 0 degrees.
const armRigs = [
  { side: "left", base: 1000, x: 89, y: 137, thumb: 1, profile: false },
  { side: "right", base: 1100, x: 151, y: 137, thumb: -1, profile: false },
  { side: "left", base: 1200, x: 91, y: 133, thumb: 1, profile: true },
  { side: "right", base: 1300, x: 110, y: 133, thumb: -1, profile: true },
];
const fingers = [
  ["Thumb", 13, 13],
  ["Index", 8, 17],
  ["Middle", 1, 21],
  ["Ring", -6, 18],
  ["Pinky", -12, 14],
];
function arm({ side, base, x, y, thumb, profile }) {
  const color = profile && side === "left" ? "FF729A85" : coat;
  return `<Node name="${side} arm ${profile ? "profile" : "front"}" id="0:${base}" x="${x}" y="${y}">
    <Node name="${side} shoulder" id="0:${base + 1}">
      <Node name="${side} elbow" id="0:${base + 2}" y="24">
        <Node name="${side} wrist" id="0:${base + 3}" y="22">
          <Node name="${side} hand visibility" id="0:${base + 4}">
            ${fingers
              .map(
                (
                  [name, fx, len],
                  i,
                ) => `<Node name="${side} ${name}" id="0:${base + 10 + i}" x="${fx * thumb}" y="${i === 0 ? -7 : -17}" rotation="${i === 0 ? thumb * 0.55 : 0}">
              ${shape(`${name} nail`, 0, -len + 3, 3, 4, light)}
              ${shape(`${name} finger`, 0, -len / 2, 5.3, len + 3, color, { rect: true, radius: 2.6 })}
            </Node>`,
              )
              .join("")}
            ${shape("Palm detail", 0, -10, 13, 10, light)}
            ${shape("Palm", -1, -10, 27, 25, color, { rect: true, radius: 8 })}
            ${shape("Wrist", 0, 0, 10, 13, color, { rect: true, radius: 4 })}
          </Node>
        </Node>
        ${shape("Elbow", 0, 0, 13, 13, color)}
        ${shape("Forearm", 0, 11, 11, 25, color, { rect: true, radius: 5.5 })}
      </Node>
      ${shape("Shoulder", 0, 0, 15, 15, color)}
      ${shape("Upper arm", 0, 12, 14, 27, color, { rect: true, radius: 7 })}
    </Node>
  </Node>`;
}
const axes = [
  // In front view, foreshortening plus separate muzzle/eye movement makes
  // nodding readable. Roll is on a separate parent, so both motions combine.
  [
    "pitch",
    [-45, 0, 55],
    (v) =>
      key(21, 15, (v * Math.PI) / 180) +
      key(92, 14, v * 0.28) +
      key(92, 17, 1 - Math.abs(v) * 0.005) +
      key(93, 14, v * 0.24) +
      key(94, 14, v * 0.34),
  ],
  [
    "forward",
    [0, 100],
    (v) =>
      key(21, 13, 1 + v * 0.35) +
      key(90, 16, 1 + v * 0.0012) +
      key(90, 17, 1 + v * 0.0012),
  ],
  ["roll", [-40, 0, 40], (v) => key(90, 15, (v * Math.PI) / 180)],
  ["lateral", [-30, 0, 30], (v) => key(90, 13, 120 + v * 0.8)],
  ["yaw", [-60, 0, 60], (v) => key(91, 13, v * 0.23)],
  ["view", [0, 1], (v) => key(80, 18, v) + key(81, 18, 1 - v)],
];
for (const side of ["left", "right"]) {
  const rigs = armRigs.filter((r) => r.side === side);
  // Adjacent samples stay below a half-turn to avoid ambiguous rotation
  // interpolation when Rive blends a negative angle into its neutral pose.
  for (const [joint, offset] of [
    ["Upper", 1],
    ["Lower", 2],
    ["Wrist", 3],
  ])
    axes.push([
      `${side}${joint}`,
      [-180, -135, -90, -45, 0, 45, 90, 135, 180],
      (v) =>
        rigs.map((r) => key(r.base + offset, 15, (v * Math.PI) / 180)).join(""),
    ]);
  for (const [i, [name]] of fingers.entries())
    axes.push([
      `${side}${name}`,
      [0, 100],
      (v) =>
        rigs
          .map(
            (r) =>
              key(r.base + 10 + i, 17, 1 - v * 0.0078) +
              key(r.base + 10 + i, 14, (i === 0 ? -7 : -17) + v * 0.025) +
              (i === 0
                ? key(r.base + 10, 15, r.thumb * (0.55 - v * 0.009))
                : ""),
          )
          .join(""),
    ]);
  axes.push([
    `${side}ArmVisible`,
    [0, 1],
    (v) => rigs.map((r) => key(r.base, 18, v)).join(""),
  ]);
  axes.push([
    `${side}HandVisible`,
    [0, 1],
    (v) => rigs.map((r) => key(r.base + 4, 18, v)).join(""),
  ]);
}
const animations = axes
  .map(([name, values, keys], i) =>
    values
      .map(
        (value, j) =>
          `<LinearAnimation name="${name} ${value}" id="0:${10000 + i * 10 + j}" duration="60" loopValue="loop">${keys(value)}</LinearAnimation>`,
      )
      .join(""),
  )
  .join("");
const layers = axes
  .map(
    ([name, values], i) =>
      `<StateMachineLayer name="${name}" id="0:${20000 + i}"><AnyState x="400" y="-100"/><ExitState x="600" y="-100"/><EntryState x="0" y="0"><StateTransition stateToId="0:${20100 + i}"/></EntryState><BlendState1DViewModel x="200" y="0" id="0:${20100 + i}"><BindablePropertyNumber><DataBindContext sourcePathIds="0:40-0:${30000 + i}" propertyKey="636"/></BindablePropertyNumber>${values.map((v, j) => `<BlendAnimation1D animationId="0:${10000 + i * 10 + j}" value="${v}"/>`).join("")}</BlendState1DViewModel></StateMachineLayer>`,
  )
  .join("");
const scene = `<Rive version="1" kind="fragment">
<Artboard name="Ane" id="0:2" width="240" height="240" styleId="0:3" defaultStateMachineId="0:7" viewModelId="0:40" viewModelInstanceId="0:41">
  <LayoutComponentStyle name="Artboard Style" id="0:3"/>
  <Node name="Face" id="0:80">
    ${armRigs
      .filter((r) => !r.profile)
      .map(arm)
      .join("")}
    <Node name="Tete de face" id="0:90" x="120" y="85">
      <Node name="Regard vertical" id="0:92">
        <Node name="Rotation du visage" id="0:91">
        <Node name="Inclinaison des yeux" id="0:93">
          ${shape("Oeil gauche", -16, -5, 6, 9, ink)}
          ${shape("Oeil droit", 16, -5, 6, 9, ink)}
        </Node>
        <Node name="Inclinaison du museau" id="0:94">
          ${shape("Narine gauche", -9, 20, 4, 4, mane)}
          ${shape("Narine droite", 9, 20, 4, 4, mane)}
          ${shape("Sourire face", 0, 28, 13, 3, mane, { rect: true, radius: 2 })}
          ${shape("Museau face", 0, 22, 51, 29, light)}
        </Node>
        </Node>
        ${shape("Tete face", 0, 0, 67, 80, coat)}
        ${shape("Oreille gauche rose", -22, -55, 8, 35, pink, { rotation: -0.18 })}
        ${shape("Oreille droite rose", 22, -55, 8, 35, pink, { rotation: 0.18 })}
        ${shape("Oreille gauche face", -22, -53, 17, 56, coat, { rotation: -0.18 })}
        ${shape("Oreille droite face", 22, -53, 17, 56, coat, { rotation: 0.18 })}
      </Node>
    </Node>
    ${shape("Cou face", 120, 133, 28, 43, coat)}
    ${shape("Ventre face", 120, 176, 41, 59, light)}
    ${shape("Corps face", 120, 171, 80, 92, coat)}
    ${shape("Sabot gauche face", 97, 218, 27, 15, ink, { rect: true })}
    ${shape("Sabot droit face", 143, 218, 27, 15, ink, { rect: true })}
    ${shape("Ombre face", 120, 233, 125, 8, "1C41675A")}
  </Node>
  <Node name="Profil" id="0:81">
  ${armRigs
    .filter((r) => r.profile)
    .reverse()
    .map(arm)
    .join("")}
  <Node name="Assis" x="96" y="171">
    <Node name="Haut du dos" id="0:20" y="-49">
      <Node name="Tete" id="0:21" x="1" y="-36">
        ${shape("Reflet", 16, -11, 3, 4, "FFFFFFFF")}
        ${shape("Oeil", 15, -9, 7, 10, ink, { id: 25 })}
        ${shape("Narine", 40, 8, 4, 5, mane, { rotation: -0.3 })}
        ${shape("Sourire", 32, 18, 14, 3, mane, { rect: true, rotation: 0.08, radius: 2 })}
        ${shape("Joue", 6, 7, 10, 7, pink)}
        ${shape("Museau", 28, 11, 43, 29, light, { rotation: -0.15 })}
        ${shape("Visage", 0, 0, 49, 61, coat, { rotation: -0.17 })}
        ${shape("Oreille proche interieur", -5, -43, 7, 31, pink, { rotation: -0.14 })}
        ${shape("Oreille proche", -5, -42, 14, 48, coat, { rotation: -0.14 })}
        ${shape("Oreille loin", -22, -39, 12, 44, mane, { rotation: -0.32 })}
        ${shape("Criniere", -22, -3, 14, 42, mane, { rotation: -0.2 })}
      </Node>
      ${shape("Ventre", 17, 16, 22, 51, light, { rotation: 0.1 })}
      ${shape("Poitrine", 4, 10, 53, 81, coat, { rotation: 0.1 })}
      ${shape("Dos", -18, 7, 13, 60, mane, { rotation: 0.06 })}
    </Node>
    ${shape("Cuisse", 15, 1, 64, 32, coat, { rotation: 0.03 })}
    ${shape("Jambe", 42, 28, 16, 51, coat, { rect: true, rotation: 0.08, radius: 8 })}
    ${shape("Sabot", 51, 51, 33, 14, ink, { rect: true, radius: 6 })}
    ${shape("Queue", -32, 4, 32, 10, mane, { rect: true, rotation: 0.4, radius: 5 })}
    ${shape("Queue bout", -46, -2, 16, 13, ink, { rotation: 0.4 })}
  </Node>
  ${shape("Assise", 106, 188, 95, 9, "FFA9C5B4", { rect: true, radius: 4 })}
  ${shape("Pied chaise", 85, 209, 7, 39, "FFA9C5B4", { rect: true, radius: 3 })}
  ${shape("Pied chaise droit", 138, 208, 7, 37, "FFA9C5B4", { rect: true, radius: 3 })}
  ${shape("Ombre", 118, 231, 141, 9, "1C41675A")}
  </Node>
  <StateMachine name="Posture" id="0:7">${layers}</StateMachine>
  ${animations}
</Artboard>
<ViewModel name="Posture" id="0:40" defaultInstanceId="0:41">${axes.map(([name], i) => `<ViewModelPropertyNumber name="${name}" id="0:${30000 + i}"/>`).join("")}<ViewModelInstance exports="true" name="Default" id="0:41">${axes.map(([name], i) => `<ViewModelInstanceNumber propertyValue="${name === "view" ? 1 : 0}" viewModelPropertyId="0:${30000 + i}"/>`).join("")}</ViewModelInstance></ViewModel>
</Rive>`;
await writeFile(new URL("../mascot-rive/scene.rml", import.meta.url), scene);
