export type Skill = {
  id: string;
  name: string;
};

/**
 * Навыки (порядок = порядок в списке). Иконка шарика — /public/skills/<id>-light.webp и <id>-dark.webp
 * (версия выбирается по теме). Чтобы добавить навык: положите две иконки и добавьте запись; node scripts/skills.mjs <папка>.
 */
export const SKILLS: Skill[] = [
  { id: "windows-server", name: "Windows Server" },
  { id: "linux", name: "Linux" },
  { id: "arch", name: "Arch Linux" },
  { id: "ubuntu", name: "Ubuntu" },
  { id: "debian", name: "Debian" },
  { id: "powershell", name: "PowerShell" },
  { id: "bash", name: "Bash" },
  { id: "python", name: "Python" },
  { id: "apache", name: "Apache" },
  { id: "docker", name: "Docker" },
  { id: "wine", name: "Wine" },
  { id: "active-directory", name: "Active Directory" },
  { id: "microsoft-exchange", name: "Microsoft Exchange" },
  { id: "zabbix", name: "Zabbix" },
  { id: "wordpress", name: "WordPress" },
  { id: "chatgpt", name: "ChatGPT" },
  { id: "claude-code", name: "Claude Code" },
  { id: "codex", name: "Codex" },
];
