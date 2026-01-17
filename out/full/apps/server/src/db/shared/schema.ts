import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, pgEnum, integer } from "drizzle-orm/pg-core";


export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

// export const schema = { user, session, account, verification };


export const roleEnum = pgEnum("role", ["PARENT", "CHILD"]);

export const family = pgTable("family", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    inviteCode: text("invite_code").notNull().unique(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const member = pgTable("member", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id),
    familyId: text("family_id").notNull().references(() => family.id),
    role: roleEnum("role").notNull().default("CHILD"),
    balance: integer("balance").notNull().default(0),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const taskStatusEnum = pgEnum("task_status", ["PENDING", "IN_PROGRESS", "REVIEW", "DONE", "REJECTED"]);

export const task = pgTable("task", {
    id: text("id").primaryKey(),
    familyId: text("family_id").notNull().references(() => family.id, { onDelete: 'cascade' }),
    authorId: text("author_id").notNull().references(() => user.id),
    assignedToId: text("assigned_to_id").references(() => user.id),

    title: text("title").notNull(),
    description: text("description"),
    points: integer("points").notNull().default(10),
    status: taskStatusEnum("status").default("PENDING").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reward = pgTable("reward", {
    id: text("id").primaryKey(),
    familyId: text("family_id").notNull().references(() => family.id, { onDelete: 'cascade' }),
    title: text("title").notNull(),
    description: text("description"),
    cost: integer("cost").notNull(),
    image: text("image"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transaction = pgTable("transaction", {
    id: text("id").primaryKey(),
    familyId: text("family_id").notNull().references(() => family.id, { onDelete: 'cascade' }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),

    amount: integer("amount").notNull(),
    description: text("description").notNull(),
    type: text("type").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const memberRelations = relations(member, ({ one }) => ({
    // Un miembro pertenece a un usuario
    user: one(user, {
        fields: [member.userId],
        references: [user.id],
    }),
    // Un miembro pertenece a una familia
    family: one(family, {
        fields: [member.familyId],
        references: [family.id],
    }),
}));

// 3. Relaciones de FAMILIAS
export const familyRelations = relations(family, ({ many }) => ({
    members: many(member),
    tasks: many(task),
    rewards: many(reward),
}));

// 4. Relaciones de TAREAS
export const taskRelations = relations(task, ({ one }) => ({
    family: one(family, {
        fields: [task.familyId],
        references: [family.id],
    }),
    assignedTo: one(user, {
        fields: [task.assignedToId],
        references: [user.id],
    }),
}));
