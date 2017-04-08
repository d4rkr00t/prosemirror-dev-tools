const ESC = 27;

export default function addKeyBindings(controller) {
  const pickerDeactivated = controller.getSignal("editor.pickerDeactivated");
  document.addEventListener("keydown", e => {
    if (e.keyCode === ESC) {
      pickerDeactivated();
    }
  });
}
