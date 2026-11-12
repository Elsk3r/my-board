// ===== CHANGE THESE (explained on the next page) =====
const MESSAGE_URL   = "https://Elsk3r.github.io/my-board/message.txt";
const LETTERS_SHOWN = 50;   // how many letters fit on the board at once
const SPEED         = 150;  // smaller number = faster scrolling
const TEXT_SIZE     = 0.7;    // bigger number = bigger letters
const BOARD_X       = 1.203;    // where the scrolling text sits in your world
const BOARD_Y       = 1.785;
const BOARD_Z       = 2.84;
const TURN_AROUND   = 270;    // use 180 if the text faces the wrong way
const SEPARATOR     = "        ";
// ===== DO NOT CHANGE ANYTHING BELOW THIS LINE =====
const scene = BS.BanterScene.GetInstance();
let message  = "Loading" + SEPARATOR;
let position = 0;
let board;

window.addEventListener("bs-loaded", () => {
  const scene = BS.BanterScene.GetInstance();

  scene.On("unity-loaded", () => {
    const obj = new BS.GameObject({
      name: "MarqueeText",
      localPosition: new BS.Vector3(BOARD_X, BOARD_Y, BOARD_Z),
      localEulerAngles: new BS.Vector3(0, TURN_AROUND, 0)
    });

    board = obj.AddComponent(new BS.BanterText({
      text: "Loading",
      color: new BS.Vector4(1, 0.84, 0.3, 1),
      fontSize: TEXT_SIZE,
      horizontalAlignment: BS.HorizontalAlignment.Center,
      verticalAlignment: BS.VerticalAlignment.Middle,
      richText: false,
      enableWordWrapping: false,
      rectTransformSizeDelta: new BS.Vector2(7.5, 1)
    }));

    getMessage();
    setInterval(getMessage, 30000);
    setInterval(scrollOneStep, SPEED);
  });
});

async function getMessage() {
  try {
    const reply = await fetch(MESSAGE_URL + "?t=" + Date.now());
    const text = (await reply.text()).replace(/\s+/g, " ").trim();
    if (text) message = text + SEPARATOR;
  } catch (e) { }
}

function scrollOneStep() {
  if (!board) return;
  const copies = Math.ceil(LETTERS_SHOWN * 2 / message.length) + 2;
  const longText = message.repeat(copies);
  board.text = longText.substr(position, LETTERS_SHOWN);
  position = (position + 1) % message.length;
}
