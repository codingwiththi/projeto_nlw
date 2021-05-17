import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SettingsRepository } from "../repositories/SettingsRepository";
import { SettingsService } from "../services/SettingsService";

class SettingsController {
  async create(req: Request, res: Response) {
    const { chat, username } = req.body;

    const settingsService = new SettingsService();

    try {
      const settings = await settingsService.create({ chat, username });

      return res.json(settings);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  async findByUsername(req: Request, res: Response) {
    const { username } = req.params;

    const settingsService = new SettingsService();
    try {
      const settings = await settingsService.findByUsername(username);

      return res.json(settings);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    const { username } = req.params;
    const { chat } = req.body;

    const settingsService = new SettingsService();
    try {
      const user = await settingsService.findByUsername(username);
      if (user) {
        await settingsService.update(username, chat);
        return res.status(200).json({ message: "update realizado" });
      } else {
        return res.status(404).json({ message: "Usuário não existe" });
      }
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
}

export { SettingsController };
