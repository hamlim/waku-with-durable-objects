import { DurableObject } from "cloudflare:workers";

export class MyDurableObject extends DurableObject {
  private sql: DurableObjectState["storage"]["sql"];

  constructor(ctx: DurableObjectState, env: Env) {
    // Required, as we're extending the base class.
    super(ctx, env);

    this.sql = ctx.storage.sql;

    this.ctx = ctx;
    this.env = env;

    this.sql.exec(`create table if not exists count(
        value integer primary key autoincrement
    )`);
  }

  //   async increment(): Promise<number> {
  //     let value: number = (await this.ctx.storage.get("value")) || 0;
  //     value += 1;
  //     await this.ctx.storage.put("value", value);
  //     return value;
  //   }

  async increment(): Promise<number> {
    const result = this.sql
      .exec<{ value: number }>(
        "insert into count (value) values (?) returning value",
        1,
      )
      .toArray();
    return result[0]?.value || 0;
  }
}

export default {};
