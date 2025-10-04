module.exports = async (tp) => {
  // wait 200ms so templater finishes writing content
  await new Promise(res => setTimeout(res, 200));
  app.commands.executeCommandById("obsidian-creases:fold-along-creases");
};
