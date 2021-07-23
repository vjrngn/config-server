---
to: src/repositories/<%= h.changeCase.paramCase(entity).toLowerCase() %>-repository.ts
---
import { EntityRepository, Repository } from 'typeorm';
import { <%= entity %> } from '../entities/<%= entity %>';

@EntityRepository(<%= entity %>)
export class <%= entity %>Repository extends Repository<<%= entity %>> {}
