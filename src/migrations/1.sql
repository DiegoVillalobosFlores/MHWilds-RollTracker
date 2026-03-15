create table if not exists WeaponClass
(
    class TEXT primary key unique
);

create table if not exists WeaponElement
(
    element TEXT primary key unique
);

create table if not exists Hunter
(
    name TEXT primary key unique,
    isLastUsed BOOLEAN
);

CREATE TABLE IF NOT EXISTS HunterWeapon
(
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    hunter_name  TEXT NOT NULL,
    class TEXT NOT NULL,
    element      TEXT NOT NULL,
    name         TEXT NOT NULL,
    FOREIGN KEY (hunter_name) REFERENCES Hunter (name) on delete cascade,
    FOREIGN KEY (class) REFERENCES WeaponClass (class) on delete cascade,
    FOREIGN KEY (element) REFERENCES WeaponElement (element) on delete cascade
);

create table if not exists HunterWeaponRoll
(
    id               integer primary key autoincrement,
    created_at       DATETIME default CURRENT_TIMESTAMP,
    updated_at       DATETIME default CURRENT_TIMESTAMP,
    hunter_weapon_id integer,
    hunter_weapon_ability_group_skill TEXT,
    hunter_weapon_ability_set_bonus TEXT,
    foreign key (hunter_weapon_id) references HunterWeapon (id) on delete cascade,
    foreign key (hunter_weapon_ability_group_skill) references HunterWeaponSkillGroup (name) on delete cascade,
    foreign key (hunter_weapon_ability_set_bonus) references HunterWeaponSetBonus (name) on delete cascade
);

create table if not exists HunterWeaponSkillGroup
(
    name TEXT primary key unique
);

create table if not exists HunterWeaponSetBonus
(
    name TEXT primary key unique
);

CREATE TABLE if not exists Settings
(
    id   integer primary key autoincrement,
    clear_console_on_render integer default 0
);

insert into WeaponClass
values ('Great Sword'),
       ('Long Sword'),
       ('Sword and Shield'),
       ('Dual Blades'),
       ('Hammer'),
       ('Hunting Horn'),
       ('Lance'),
       ('Gunlance'),
       ('Switch Axe'),
       ('Charge Blade'),
       ('Insect Glaive'),
       ('Heavy Bowgun'),
       ('Light Bowgun'),
       ('Bow')
on conflict (class) do nothing;

insert into WeaponElement
values ('Fire'),
       ('Water'),
       ('Thunder'),
       ('Ice'),
       ('Dragon'),
       ('Blast'),
       ('Poison'),
       ('Sleep'),
       ('Paralysis'),
       ('Exhaust')
on conflict (element) do nothing;

insert into HunterWeaponSkillGroup
values ("Arkveld's Hunger"),
       ("Blangonga's Spirit"),
       ("Blossomdance Prayer"),
       ("Doshaguma's Might"),
       ("Dreamspell Prayer"),
       ("Ebony Odogaron's Power"),
       ("Flamefete Prayer"),
       ("Fulgur Anjanath's Will"),
       ("Gogmapocalypse"),
       ("Gore Magala's Tyranny"),
       ("Gravios's Protection"),
       ("Guardian Arkveld's Vitality"),
       ("Jin Dahaad's Revolt"),
       ("Leviathan's Fury"),
       ("Lumenhymn Prayer"),
       ("Mizutsune's Prowess"),
       ("Nu Udra's Mutiny"),
       ("Omega Resonance"),
       ("Rathalos's Flare"),
       ("Rey Dau's Voltage"),
       ("Seregios's Tenacity"),
       ("Soul of the Dark Knight"),
       ("Uth Duna's Cover"),
       ("Xu Wu's Vigor"),
       ("Zoh Shia's Pulse")
on conflict (name) do nothing;

insert into HunterWeaponSetBonus
values ("Alluring Pelt"),
       ("Buttery Leathercraft"),
       ("Festival Spirit"),
       ("Flexible Leathercraft"),
       ("Fortifying Pelt"),
       ("Guardian's Protection"),
       ("Guardian's Pulse"),
       ("Imparted Wisdom"),
       ("Lord's Favor"),
       ("Lord's Fury"),
       ("Lord's Soul"),
       ("Master of the Fist"),
       ("Neopteron Alert"),
       ("Neopteron Camouflage"),
       ("Scale Layering"),
       ("Scaling Prowess")
on conflict (name) do nothing;

insert into Settings (clear_console_on_render)
values (0);
