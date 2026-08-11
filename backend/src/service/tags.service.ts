import { TagRepository } from "../repository/tags.repository.js";

const tagRepository = new TagRepository();

export class TagService {
  async createTag(name: string) {
    return await tagRepository.create(name);
  }

  async getAllTags() {
    return await tagRepository.getAll();
  }

  async getTagById(id: number) {
    const tag = await tagRepository.findById(id);
    if (!tag) {
      throw new Error("Tag not found");
    }
    return tag;
  }

  async updateTag(id: number, name: string) {
    const tag = await tagRepository.findById(id);
    if (!tag) {
      throw new Error("Tag not found");
    }
    return await tagRepository.update(id, name);
  }

  async deleteTag(id: number) {
    const tag = await tagRepository.findById(id);
    if (!tag) {
      throw new Error("Tag not found");
    }
    return await tagRepository.delete(id);
  }
}
