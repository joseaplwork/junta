--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

-- Started on 2024-01-04 04:20:46 CET

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
--
-- TOC entry 3656 (class 1262 OID 32768)
-- Name: juntas; Type: DATABASE; Schema: -; Owner: joseparedes
--

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
-- TOC entry 217 (class 1259 OID 32783)
-- Name: Administrators; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Administrators" (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    role character varying NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public."Administrators" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 32776)
-- Name: Groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Groups" (
    id uuid NOT NULL,
    creation_date timestamp with time zone,
    name character varying NOT NULL
);


ALTER TABLE public."Groups" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 32790)
-- Name: Juntas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Juntas" (
    id uuid NOT NULL,
    admin_id uuid NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    amount integer NOT NULL,
    active boolean NOT NULL,
    name text NOT NULL,
    slots integer NOT NULL,
    partial_amount integer NOT NULL
);


ALTER TABLE public."Juntas" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 32797)
-- Name: JuntasGroups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JuntasGroups" (
    id uuid NOT NULL,
    group_id uuid NOT NULL,
    junta_id uuid NOT NULL,
    "order" integer NOT NULL
);


ALTER TABLE public."JuntasGroups" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 32802)
-- Name: JuntasPartialAmount; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JuntasPartialAmount" (
    id uuid NOT NULL,
    junta_group_id uuid NOT NULL,
    date timestamp with time zone NOT NULL,
    paid timestamp with time zone NOT NULL,
    partial_amount timestamp with time zone NOT NULL
);


ALTER TABLE public."JuntasPartialAmount" OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 32769)
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id uuid NOT NULL,
    group_id uuid,
    name character varying NOT NULL,
    surname character varying NOT NULL,
    phone_number integer NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- TOC entry 3647 (class 0 OID 32783)
-- Dependencies: 217
-- Data for Name: Administrators; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Administrators" (id, user_id, role, username, password) FROM stdin;
\.


--
-- TOC entry 3646 (class 0 OID 32776)
-- Dependencies: 216
-- Data for Name: Groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Groups" (id, creation_date, name) FROM stdin;
\.


--
-- TOC entry 3648 (class 0 OID 32790)
-- Dependencies: 218
-- Data for Name: Juntas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Juntas" (id, admin_id, start_date, end_date, amount, active, name, slots, partial_amount) FROM stdin;
\.


--
-- TOC entry 3649 (class 0 OID 32797)
-- Dependencies: 219
-- Data for Name: JuntasGroups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JuntasGroups" (id, group_id, junta_id, "order") FROM stdin;
\.


--
-- TOC entry 3650 (class 0 OID 32802)
-- Dependencies: 220
-- Data for Name: JuntasPartialAmount; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JuntasPartialAmount" (id, junta_group_id, date, paid, partial_amount) FROM stdin;
\.


--
-- TOC entry 3645 (class 0 OID 32769)
-- Dependencies: 215
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, group_id, name, surname, phone_number) FROM stdin;
\.


--
-- TOC entry 3489 (class 2606 OID 32789)
-- Name: Administrators Administrators_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Administrators"
    ADD CONSTRAINT "Administrators_pkey" PRIMARY KEY (id);


--
-- TOC entry 3487 (class 2606 OID 32782)
-- Name: Groups Groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_pkey" PRIMARY KEY (id);


--
-- TOC entry 3493 (class 2606 OID 32801)
-- Name: JuntasGroups JuntasGroups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JuntasGroups"
    ADD CONSTRAINT "JuntasGroups_pkey" PRIMARY KEY (id);


--
-- TOC entry 3495 (class 2606 OID 32806)
-- Name: JuntasPartialAmount JuntasPartialAmount_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JuntasPartialAmount"
    ADD CONSTRAINT "JuntasPartialAmount_pkey" PRIMARY KEY (id);


--
-- TOC entry 3491 (class 2606 OID 32796)
-- Name: Juntas Juntas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Juntas"
    ADD CONSTRAINT "Juntas_pkey" PRIMARY KEY (id);


--
-- TOC entry 3485 (class 2606 OID 32775)
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- TOC entry 3497 (class 2606 OID 32812)
-- Name: Administrators Administrators_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Administrators"
    ADD CONSTRAINT "Administrators_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) NOT VALID;


--
-- TOC entry 3499 (class 2606 OID 32827)
-- Name: JuntasGroups JuntasGroups_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JuntasGroups"
    ADD CONSTRAINT "JuntasGroups_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public."Groups"(id) NOT VALID;


--
-- TOC entry 3500 (class 2606 OID 32822)
-- Name: JuntasGroups JuntasGroups_junta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JuntasGroups"
    ADD CONSTRAINT "JuntasGroups_junta_id_fkey" FOREIGN KEY (junta_id) REFERENCES public."Juntas"(id) NOT VALID;


--
-- TOC entry 3501 (class 2606 OID 32832)
-- Name: JuntasPartialAmount JuntasPartialAmount_junta_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JuntasPartialAmount"
    ADD CONSTRAINT "JuntasPartialAmount_junta_group_id_fkey" FOREIGN KEY (junta_group_id) REFERENCES public."JuntasGroups"(id) NOT VALID;


--
-- TOC entry 3498 (class 2606 OID 32817)
-- Name: Juntas Juntas_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Juntas"
    ADD CONSTRAINT "Juntas_admin_id_fkey" FOREIGN KEY (admin_id) REFERENCES public."Administrators"(id) NOT VALID;


--
-- TOC entry 3496 (class 2606 OID 32807)
-- Name: Users Users_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public."Groups"(id) NOT VALID;


-- Completed on 2024-01-04 04:20:46 CET

--
-- PostgreSQL database dump complete
--

