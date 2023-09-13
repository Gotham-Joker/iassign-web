import {SnowflakeId} from "./snowflake-id";

export class IdWorker {
    private static generator = new SnowflakeId();

    static nextId(): string {
        return this.generator.generate();
    }
}