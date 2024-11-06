import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskLinkDto } from "./create-task-link.dto";

export class UpdateTaskLinkDto extends PartialType(CreateTaskLinkDto)
{ }
