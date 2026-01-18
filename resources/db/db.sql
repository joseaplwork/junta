--
-- PostgreSQL database schema for Junta System
-- Based on design.md specification
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS juntas;

CREATE DATABASE juntas WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = icu LOCALE = 'en_US.UTF-8' ICU_LOCALE = 'en-US';

ALTER DATABASE juntas OWNER TO joseparedes;

\connect juntas

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';
SET default_table_access_method = heap;

--
-- Table: Participants
-- People who participate in juntas
--
CREATE TABLE public."Participants" (
    id uuid NOT NULL,
    name character varying NOT NULL,
    surname character varying NOT NULL,
    phone_number character varying NOT NULL
);

ALTER TABLE public."Participants" OWNER TO postgres;
ALTER TABLE ONLY public."Participants" ADD CONSTRAINT "Participants_pkey" PRIMARY KEY (id);

--
-- Table: Administrators
-- Participants who can create and manage juntas
--
CREATE TABLE public."Administrators" (
    id uuid NOT NULL,
    participant_id uuid NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    roles character varying[] NOT NULL DEFAULT ARRAY['admin']::character varying[]
);

ALTER TABLE public."Administrators" OWNER TO postgres;
ALTER TABLE ONLY public."Administrators" ADD CONSTRAINT "Administrators_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Administrators" ADD CONSTRAINT "Administrators_email_key" UNIQUE (email);
ALTER TABLE ONLY public."Administrators" ADD CONSTRAINT "Administrators_participant_id_fkey" FOREIGN KEY (participant_id) REFERENCES public."Participants"(id) NOT VALID;

--
-- Table: Juntas
-- Savings cycles with participants and payment schedules
--
CREATE TABLE public."Juntas" (
    id uuid NOT NULL,
    admin_id uuid NOT NULL,
    name text NOT NULL,
    amount integer NOT NULL,
    slots integer NOT NULL,
    partial_amount integer NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    active boolean NOT NULL
);

ALTER TABLE public."Juntas" OWNER TO postgres;
ALTER TABLE ONLY public."Juntas" ADD CONSTRAINT "Juntas_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Juntas" ADD CONSTRAINT "Juntas_admin_id_fkey" FOREIGN KEY (admin_id) REFERENCES public."Administrators"(id) NOT VALID;

--
-- Table: Slots
-- Organizational units representing payment periods within a junta
-- One slot is created per month of the junta's duration
--
CREATE TABLE public."Slots" (
    id uuid NOT NULL,
    junta_id uuid NOT NULL,
    name character varying,
    "order" integer NOT NULL
);

ALTER TABLE public."Slots" OWNER TO postgres;
ALTER TABLE ONLY public."Slots" ADD CONSTRAINT "Slots_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Slots" ADD CONSTRAINT "Slots_junta_id_fkey" FOREIGN KEY (junta_id) REFERENCES public."Juntas"(id) NOT VALID;

--
-- Table: ParticipantsSlots
-- Junction table linking participants to slots
-- Ensures one participant can only belong to one slot per junta
--
CREATE TABLE public."ParticipantsSlots" (
    id uuid NOT NULL,
    participant_id uuid NOT NULL,
    slot_id uuid NOT NULL
);

ALTER TABLE public."ParticipantsSlots" OWNER TO postgres;
ALTER TABLE ONLY public."ParticipantsSlots" ADD CONSTRAINT "ParticipantsSlots_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."ParticipantsSlots" ADD CONSTRAINT "ParticipantsSlots_participant_id_fkey" FOREIGN KEY (participant_id) REFERENCES public."Participants"(id) NOT VALID;
ALTER TABLE ONLY public."ParticipantsSlots" ADD CONSTRAINT "ParticipantsSlots_slot_id_fkey" FOREIGN KEY (slot_id) REFERENCES public."Slots"(id) NOT VALID;

--
-- Table: Contributions
-- Tracks participant contributions per month per junta
--
CREATE TABLE public."Contributions" (
    id uuid NOT NULL,
    participant_id uuid NOT NULL,
    junta_id uuid NOT NULL,
    slot_id uuid NOT NULL,
    month integer NOT NULL,
    amount decimal(10,2) NOT NULL,
    paid_date timestamp with time zone,
    status character varying NOT NULL DEFAULT 'pending'::character varying
);

ALTER TABLE public."Contributions" OWNER TO postgres;
ALTER TABLE ONLY public."Contributions" ADD CONSTRAINT "Contributions_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Contributions" ADD CONSTRAINT "Contributions_participant_id_fkey" FOREIGN KEY (participant_id) REFERENCES public."Participants"(id) NOT VALID;
ALTER TABLE ONLY public."Contributions" ADD CONSTRAINT "Contributions_junta_id_fkey" FOREIGN KEY (junta_id) REFERENCES public."Juntas"(id) NOT VALID;
ALTER TABLE ONLY public."Contributions" ADD CONSTRAINT "Contributions_slot_id_fkey" FOREIGN KEY (slot_id) REFERENCES public."Slots"(id) NOT VALID;

--
-- Table: Payouts
-- Tracks when slots receive money (payout) from the junta pool per junta
--
CREATE TABLE public."Payouts" (
    id uuid NOT NULL,
    slot_id uuid NOT NULL,
    junta_id uuid NOT NULL,
    month integer NOT NULL,
    amount_received decimal(10,2) NOT NULL,
    received_date timestamp with time zone,
    is_fully_paid boolean NOT NULL DEFAULT false
);

ALTER TABLE public."Payouts" OWNER TO postgres;
ALTER TABLE ONLY public."Payouts" ADD CONSTRAINT "Payouts_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Payouts" ADD CONSTRAINT "Payouts_slot_id_fkey" FOREIGN KEY (slot_id) REFERENCES public."Slots"(id) NOT VALID;
ALTER TABLE ONLY public."Payouts" ADD CONSTRAINT "Payouts_junta_id_fkey" FOREIGN KEY (junta_id) REFERENCES public."Juntas"(id) NOT VALID;

--
-- Table: Distributions
-- Tracks how much each participant received per junta
--
CREATE TABLE public."Distributions" (
    id uuid NOT NULL,
    payout_id uuid NOT NULL,
    participant_id uuid NOT NULL,
    junta_id uuid NOT NULL,
    amount_distributed decimal(10,2) NOT NULL,
    distributed_date timestamp with time zone
);

ALTER TABLE public."Distributions" OWNER TO postgres;
ALTER TABLE ONLY public."Distributions" ADD CONSTRAINT "Distributions_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Distributions" ADD CONSTRAINT "Distributions_payout_id_fkey" FOREIGN KEY (payout_id) REFERENCES public."Payouts"(id) NOT VALID;
ALTER TABLE ONLY public."Distributions" ADD CONSTRAINT "Distributions_participant_id_fkey" FOREIGN KEY (participant_id) REFERENCES public."Participants"(id) NOT VALID;
ALTER TABLE ONLY public."Distributions" ADD CONSTRAINT "Distributions_junta_id_fkey" FOREIGN KEY (junta_id) REFERENCES public."Juntas"(id) NOT VALID;

--
-- Create enum type for Contribution status
--
CREATE TYPE contribution_status AS ENUM ('pending', 'paid', 'overdue');

--
-- Add constraint to ensure contribution status is valid
--
ALTER TABLE public."Contributions" ADD CONSTRAINT "Contributions_status_check" CHECK (status IN ('pending', 'paid', 'overdue'));
