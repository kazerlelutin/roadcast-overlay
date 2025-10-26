import { server } from "@/index";
import type { BunRequest } from "bun";
import { readdirSync } from "fs";


export const actionsGET = async () => {
  const templates = readdirSync('data/templates');
  const custom = readdirSync('data/custom');

  const templatesData: { name: string; content: string, suffix: string }[] = [];

  for (const template of [...templates.map(template => `templates/${template}`), ...custom.filter(custom => custom !== '.gitkeep').map(custom => `custom/${custom}`)]) {

    const templateFile = Bun.file(`data/${template}`);
    const templateContent = await templateFile.text();
    const suffix = (template.split('/').pop()?.split('+')?.[1] || '').split('.')[0] || '';
    const name = template.split('/').pop() || ''
    templatesData.push({
      name,
      suffix: suffix,
      content: templateContent,
    });
  }

  return Response.json(templatesData);
}

export const actionExecuteGET = async (req: BunRequest) => {
  const { id, script: scriptParam, overlay } = req.params as { id: string; script: string; overlay: string };

  const script = scriptParam.split('+')[0];
  const suffix = scriptParam.split('+')[1];
  if (id === 'clear' && script === 'screen') {
    server.publish(overlay, JSON.stringify({
      type: 'action',
      room: overlay,
      data: { id: 'clear', script: 'screen', html: '', suffix }
    }));
    return new Response("ok", { status: 200 });
  }

  if (id === 'null') {
    return Response.json({ error: 'Action ID is required' }, { status: 400 });
  }

  let templateFile = Bun.file(`data/templates/${id}`);

  if (!templateFile.exists()) {
    return Response.json({ error: 'Template not found' }, { status: 404 });
  }
  const customFile = Bun.file(`data/custom/${id}`);
  if (await customFile.exists()) {
    templateFile = customFile;
  }

  const html = await templateFile.text();
  server.publish(overlay, JSON.stringify({
    type: 'action',
    room: overlay,
    data: { id, script, html, suffix }
  }));

  return new Response("ok", { status: 200 });
}



export const actionInputGET = async (req: BunRequest) => {
  const { name } = req.params as { name: string };
  const input = Bun.file(`data/inputs/${name}.txt`);
  const inputContent = (await input.exists()) ? await input.text() : null;
  return new Response(inputContent || '', { status: 200 });
}

