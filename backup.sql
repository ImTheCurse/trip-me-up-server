--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6 (Debian 16.6-1.pgdg120+1)
-- Dumped by pg_dump version 16.6 (Ubuntu 16.6-0ubuntu0.24.04.1)

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: trip_me_up_db_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO my_trip_db_i6x9_user;

--
-- Name: preferences; Type: TYPE; Schema: public; Owner: trip_me_up_db_user
--

CREATE TYPE public.preferences AS (
	season text,
	country text,
	cities text[],
	hobbies text[],
	num_of_days integer,
	num_of_travelers integer
);


ALTER TYPE public.preferences OWNER TO trip_me_up_db_user;

--
-- Name: weather; Type: TYPE; Schema: public; Owner: trip_me_up_db_user
--

CREATE TYPE public.weather AS (
	day date,
	region text,
	weather_type text
);


ALTER TYPE public.weather OWNER TO trip_me_up_db_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: place; Type: TABLE; Schema: public; Owner: trip_me_up_db_user
--

CREATE TABLE public.place (
    id integer NOT NULL,
    name text NOT NULL,
    lng double precision NOT NULL,
    lat double precision NOT NULL,
    icon_url text,
    rating real,
    address text,
    photo_ref text[],
    description text,
    notes text[]
);


ALTER TABLE public.place OWNER TO trip_me_up_db_user;

--
-- Name: place_id_seq; Type: SEQUENCE; Schema: public; Owner: trip_me_up_db_user
--

CREATE SEQUENCE public.place_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.place_id_seq OWNER TO trip_me_up_db_user;

--
-- Name: place_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trip_me_up_db_user
--

ALTER SEQUENCE public.place_id_seq OWNED BY public.place.id;


--
-- Name: routes; Type: TABLE; Schema: public; Owner: trip_me_up_db_user
--

CREATE TABLE public.routes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    start_date date,
    end_date date,
    places integer[]
);


ALTER TABLE public.routes OWNER TO trip_me_up_db_user;

--
-- Name: routes_id_seq; Type: SEQUENCE; Schema: public; Owner: trip_me_up_db_user
--

CREATE SEQUENCE public.routes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.routes_id_seq OWNER TO trip_me_up_db_user;

--
-- Name: routes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trip_me_up_db_user
--

ALTER SEQUENCE public.routes_id_seq OWNED BY public.routes.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: trip_me_up_db_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    username character varying(255),
    password character varying(255)
);


ALTER TABLE public.users OWNER TO trip_me_up_db_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: trip_me_up_db_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO trip_me_up_db_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trip_me_up_db_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: place id; Type: DEFAULT; Schema: public; Owner: trip_me_up_db_user
--

ALTER TABLE ONLY public.place ALTER COLUMN id SET DEFAULT nextval('public.place_id_seq'::regclass);


--
-- Name: routes id; Type: DEFAULT; Schema: public; Owner: trip_me_up_db_user
--

ALTER TABLE ONLY public.routes ALTER COLUMN id SET DEFAULT nextval('public.routes_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: trip_me_up_db_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: place; Type: TABLE DATA; Schema: public; Owner: trip_me_up_db_user
--

COPY public.place (id, name, lng, lat, icon_url, rating, address, photo_ref, description, notes) FROM stdin;
162	Hilton Beach	34.7694051	32.0903273	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png	4.5	Hilton Beach, Israel	{AVzFdbk50FoL2iPCXYrME8WmS_b_zvVqLpt0SLB49_q0PUkhyIovv1jK1XYxD5KVSBAaMokMzFVshjFchEq8gfMVHrAulQQ05g9R3T66HUn-Wa7wkwKEqnu5LZ4f6yFs6gYRZ9ZVlz5dRQc77Cy97RzYKTb5WeCdphwbqhK3GuoVG75qWs04}	A popular beach known for its sandy shores, clear waters, and vibrant atmosphere. It's perfect for swimming and sunbathing.	\N
163	Gordon Beach	34.7674219	32.0826977	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png	4.6	Gordon Beach, Israel	{AVzFdbnNS9-QhYpNHgQ4CMQ8mPzHrMe59p7nkHYpUOQY2eQahz6LOslIezIQFshONMI4IzfsngUu_dLoXeKNul3LL_hYY_2IqDFxWBUt7htB3mcZoG9R0KB-hp1rsTvQq3valkcml4dbOD7x2IRwePY0JFc5ceONPOIEiuuPalzL5Lyt25FA}	One of the most famous beaches in Tel Aviv, featuring calm waters ideal for swimming, sun loungers, and beachfront cafes.	\N
164	Frishman Beach	34.766799	32.080185	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png	4.6	Frishman Beach, Israel	{AVzFdbknPAs2hlGMUKRVUmk3K9MxxLoyEZggECe-SIFyOlvHt3AIzmmCesp07GDfCgHeCVS-IhAyithLU35AtqBeD8De66apcY2wSVRibmPC0fx7BFc-sstWaLv0O4AA9LQqxZ5Hbmc2UcDDNVRfVDIK2ULc5bXbnTVtXpNx0jC58788inuN}	A bustling beach with excellent swimming conditions and a lively ambiance, popular among locals and tourists alike.	\N
165	Bananas Shisha Lounge	8.646265	50.1168549	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png	4.8	Schloßstraße 117, 60486 Frankfurt am Main, Germany	{AVzFdbl277gt14yJYBlQx-Tro1VQe_6wRxYTmw0MD0jnCVtrLGD4p9GfmAI7i53evPkf9Xe-tYut6q6hLEnTxakNSIKk3bSzpurcfMtlojDhl4yP7haa3_KzKGiAleG8Aibnn09tXB6xDJRttNtvK40M2uhdXRUh6WD5LELCvumKfV-LAMAC}	A charming beach known for its laid-back vibe and great swimming opportunities, with beautiful sunsets.	\N
166	Tel Aviv Marina	34.767926	32.0861654	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png	4.6	Eliezer Peri St 14, Tel Aviv-Yafo, Israel	{AVzFdbnrexFG4cp1froLpTQvFT6kSCl70A6ztfQh6s4NUm4KPJ1gHuecR2g-IInnHlbUvurgSAqqARF3MSJvyijYehYasYzVyp_FeJ-YU8ypsj0jwss7tt3jWzJ-WOoyoafZfZo2iP9ONJ2EUgsqtl203wupBO715vG_DXRnJnrsE8iY-YrI}	Ideal for swimming and enjoying the sea, this area has various amenities including cafés and rental facilities for water sports.	\N
167	Tel Aviv Beach	34.765367	32.0748062	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png	4.7	Tel Aviv Beach, Shlomo Lahat Promenade, Tel Aviv-Yafo, Israel	{AVzFdbkA6eBgmw93J2SaKrrVNrFX4QN6Obm2XSBSn7z0AwCPTwYB9-onA3NXnJGnDbPNoZ4yHm8Vyy2XeJotMja6OBNVCJkwoXIcTj0OEkKpcoxZAK51OjUFuZta3QVZngnHtr-qtU6ItS7krPJVvrZGJuIz8Oevzo1eBx2qw9zGwfheNxyI}	The beautiful Mediterranean beaches of Tel Aviv are perfect for swimming, sunbathing, and enjoying beachside cafes. Popular spots include Gordon Beach, Frishman Beach, and Hilton Beach.	\N
168	Wave Beach Lagos	3.4863867	6.4228901	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png	4.3	Oba Elegushi Beach Rd, Lekki Phase I, Lagos 106104, Lagos, Nigeria	{AVzFdblHx-LJRzrYEGUNoLeJ2NVDebStibM4LHPCoTKulG9368NFYc-oougU1yjU_iMVrkGSfjhfzKIsYrfQv1bRpJzw5zGjQ5KTnrIo32pzfLuxmsFkQbpTn4dFkzDy1taq7bdBCDStI2WJG8zp9Cjz-__Pso6CC8Jua8EhQ039Nt_C313U}	Known for its great swimming spot and wave conditions, The Wave Beach is a popular choice in Tel Aviv for swimming enthusiasts. There's also a beach bar and lifeguards on duty.	\N
169	Hilton Beach	34.7694051	32.0903273	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png	4.5	Hilton Beach, Israel	{AVzFdbn_pIOAE8rIaf_RDa9IVaj2gbqdxZ6mpL1C06UzmFAsATxDF87JwsQFpOQk8zO9oc0p_ckFRSlIULGvomejVX9wK95v43CGfBERckFgrP854F3BupqL8x0BI8ButBmM8qz2-x7-ftGW6t9VGWExh5115cR2vyMIgqhQFlQRmrZIPgY1}	A famous beach located in the city’s northern part, Hilton Beach is ideal for swimming and water sports. Equipped with facilities and nearby restaurants, it’s great for a full day by the sea.	\N
170	Tel Aviv Port	34.7737774	32.0972969	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png	4.5	Nemal Tel Aviv St, Tel Aviv-Yafo, Israel	{AVzFdbk81w30K30bNFOezxmiC1PqKlKI6DmA51oSh90rnx67wgTxnlmDNvkzXm6UyZXNEzfjFoFK9_rmSzo6Wc6Ucmxm0Nvf4KxVGgiKkxpow1_lrHb-ub5RRQoFsl6bVfMV-iYLWkCBGac02W8WAIYQ3yMSlcrCCesN6xCpQfKb-dUBWlB9}	This area features a boardwalk along the beach, with access to swimming areas, cafes, and shops. A great place to enjoy a swim and explore the vibrant port area.	\N
171	Hilton Beach	34.7694051	32.0903273	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png	4.5	Hilton Beach, Israel	{AVzFdbk0sAX9Y--ocJhG1337qlFgI7TOkGgpiHFelex-Maptxbal1QykbwLCYgJ-dvIEiyoMdXMSW-yaEPa3KT0SkTlNVPZ7V7LW_GGly3om_JyzAS9TnOKqmzpPC-52HTh2s5sfZ3qhCKme4L78CU-g6QLuf0o-h5x74HlYVD_LXG8xp1FW}	\N	\N
172	Frishman Beach	34.766799	32.080185	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png	4.6	Frishman Beach, Israel	{AVzFdbmk8IBqldXHOW1p9XYaWD1QW-xBwZfCYcN_aZu5sMiRGuBEL-aKSbYY266V20Osx0AHj40DT6O0YLKPFEkl6tzsaMelR07YNfKT9e-6DHsIvCpNSqprW8sbOP7UD3yhqlmj-sgdRKK9K2oittgyt0orQjv-Sq-1hpF8Ao0t1JBg2Pzb}	\N	\N
173	Gordon Beach	34.7674219	32.0826977	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png	4.6	Gordon Beach, Israel	{AVzFdbmKA_VCE9TOmgXp96_NaD-rXBum8KMX4Ja4ShtZUc9dWJZYj9OOTEkrvVvOngVQBcHl79b5fYng1Cdf4Lif9-Ir0OJWQKIxBhO6ciGDfeJgNxQBTxhFvebct3CDe1rZ9GQeAPajGzS1bE5GjGz9pbn0X1ZPnElrLJgjHnlGINzXfv5k}	\N	\N
174	Dolphin Reef Beach	34.936033	29.5264378	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png	4.4	Dolphin Reef Beach, Eilat, Israel	{AVzFdblwdEM8xLoXJtDoWz2_fkegebaCYvG3bR6foJjrCSo0GKKWaflT0S4nseDKZoP8j7xeHrUOnqtHcSa40atXf8QL2O4fz_7WqZ5T9ybfhtRXIYT9ePF5CWCvNT5LZcjNnIpK_xv1QLeex8Ul9j_xtQzQfbM7kXbOxQrj8DTFjahQqn1e}	\N	\N
175	שמורת טבע חוף האלמוגים	34.9210677	29.50794579999999	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png	4.6	שמורת טבע חוף האלמוגים, Eilat, Israel	{AVzFdbkMigzPJGOv9qyb49Nj_5KNXnRoNeYVmxbDgoqr2r-01vOpOUtXwqV32Qali0vD75YXPwgJqmbuqeLjrQ8UWjoRHsFAT7GRJzyOQvYhAechsrJF-l2JKLYKsPcitpqyp9C2aNkepjTGOfEK1VDXwXy_v9z72syVcp99zKZSuaHQefUd}	\N	\N
183	Gordon Beach	34.7674219	32.0826977	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png	4.6	Gordon Beach, Israel	{AVzFdbmGAipNXAB3Bq1gv71O3pbZTpnUb7AKyUGIDCRjCwKnTN_wP-Y-d3sZYDiidc8tHlJBJVGmk5y4VP_oJzoqe1FdBLZ5_pHPqPSol1zuVYf5HgtBPiW3fDIkI4IIwnPkS7KObKK5PsrrHc9z_CX512jJFxie3-LDt-HUTnwcMJzDRH37,AVzFdbmWojzc1XHV0rhvj6_Q33MWU1St_Pr5PPMxlTOkbfaBQvxycbhAEPoru9_YLbKFZeZT6NCss8iWV-_eE_dPM-2ZU0fBWKq-6EdOqHNk4QEjcJqOXNdMniI4KWtA_lZuTsnRnd0NjGJ7-8sRjcrzRFb6vQAqVqHzf7QngkHiJIVpURt_,AVzFdbnXsSEPhPd8qgIhiK7WzIj06Nu_O7V5WDqlSVkVzjI26_JePLwq0VB4X7XB3Bh47NtTPkzbIcWxLplArNmjlFc4lFhZnzAoakjhHUz0c3JPELr06BlRAJ-z33Fwmf1ROfY6E-YT_IQ8ifDTRMK2OWWai484QfbCRyViY9vtqtLdvm60,AVzFdblU_w3f053HapFMq9Li_hMTZWrUcmfgTMKYkJP3ywwwp3DVO1ry_yIANTmmzSIRPDzx2XdgquWlz253BsY76shdfe81kuHJScvjdx5WgbAlwdZTmDlhRjy069zqi9FND6rihrzZaQi8sQHL7fwJBrmvTJHanvvTuMdrrNRXlrdWhgIk}	Famous for its clear waters and swimming areas, with lots of amenities and a beachfront promenade for relaxing walks.	\N
176	Hilton Beach	34.7694051	32.0903273	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png	4.5	Hilton Beach, Israel	{AVzFdbkNaLiPuMh__tTECxQVKtTiCtiSkbipGOtRjE1iIQodU1FfNPdjShNkjcV27hMoeItr5VSBCzvnd1EHSD7cBC9yQJGrG2tEN7x9FRPd2Maz2kAf4NGx0xZ3fE1WlSf1qWO0X4GDPEJHo1tIO9E2I_3NKk6JUa-GU2vLXRyK2ev0BLV0,AVzFdbk3m2ZEQ5BTNrlf6hxFDXOCjYGkEocExn-ba5bSg1DjaczOMLtnrorKrS1l4GX2lhNx0RnjUqiTOtiP_YNn1HtUZCbgYrCZYItZ2g5-rIdYuphhsvLJJF8UraCYtnWOmhup9Yv2SNWdurrlTVy5KXH7mCVdzTkIHZcWKmfprXDrbAFn,AVzFdbkFIDs63JjPhj318T7MOnonL4V4giBiiClM_6g6Z9zrVNOJId-AqRH-fhWxk7H8T6ygOZUCxmiUPmqmVSEXAE41pqP4EHfk2zO2qpe94Z0BFZzuKPzcaZEI3IUmylt92FCQAFNDyJPbf8rbkFrKMBKxGCWH5R2oSP8IrzXpWebGh0LN,AVzFdbnRlr7hverDA9iakcj_hzp-oG8M-MZt0mVsOPXIKTwOKA6eJfc8vRm90BkZx34jfS_bF3VSKcNLotqVVkjm_qF-MUcS5mplTFstc53Q9uU4FeUM73ALKYBUvqvNTXQasAZhQitZmn7h7eEqzVwY2jKRI1XM_cMTMTjWsaj-JTGloGkP}	A popular urban beach known for its vibrant atmosphere, great swimming conditions, and nearby restaurants. Ideal for sunbathing and swimming enthusiasts.	\N
177	Tel Aviv Marina	34.767926	32.0861654	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png	4.6	Eliezer Peri St 14, Tel Aviv-Yafo, Israel	{AVzFdbnt6hfLsyw0A_Ka0j2y8g9Wj3cVNpgVDFCx-nlGkwLvia5pvkY_DTbGsA-OHf0BC1GyfotAPjF-EaAeLBozoEzi0DVgnu0I8_4S6kRalw8oOimCOcOYoEFwyNsDeOsJ9vS7MhGdWzceZUXrjjiUT3R0Yh_ZZFgsqnf0Bmc6ra7en6e9,AVzFdbnOHRygsV4v6Iu--M5x0Kld05q0kJB-xFmu5PlCNPZ0V2jWzGsIeOcw5_8tti-jh-hcGno60IHvXLRZm19fh8EBoJOaP7gvFLGFp1HbVT6IXVQwdQT6hE_TybyUndcfTVTwgm9TqB-OJIQb0A_7l3AZFGa87kmb5-YerLXS3pXsMUXv,AVzFdblmVIQQjVYUiTZB9jhOwympOjsx97IvDiV1XC6_IG_NM0OsqjBpjjubVJcNkVx0MDma0OyEgiVOSeGGWOPjgbgGmp3otQzigvFeT9gVToeHud7v3EcYKM5VCOhsJaDVsbvV9R0dR9OFvnfmqqPigFzXk_iyXSsEyxcMswiab8YCofZf,AVzFdblEqKHdeIRMm0ZWZZfs1hvoscJAEREsA-4xuvYJ3BuJOuThiG_tTSSiuU_8YlHirWf9emZoSOoKPUxaZf_bSh94uDIGLHigXL5C5G0yfizkU1Y1t9Gged5ByRvMyKQKbiDY8EfO8ddXQK-blrQrocRIqHguLhWdg0Tv9b-JEELfedjR}	A scenic marina with calm waters perfect for a refreshing swim, surrounded by cafes and shops. It's a pleasant area to relax after a swim.	\N
178	Jerusalem Beach	34.7639466	32.0736191	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png	4.6	Jerusalem Beach, Israel	{AVzFdbl-hzW5PexiwRzdaqzFE-TQ-lwYimlIAg1urJhpZ56_YPtAwc9403lfn4pikmhre6Jlc6MyNoQFYRDGyWqtmoG-i3x74c1XhA8wd6Std7QlrQCMJG3TW_vyLbjqnE7dpChwuUYm__1gd4VuSj1jqMFKovSEoCzO38thHP5dIKSiXI73,AVzFdbm74QbwCXAUN4epEu8fQCJmrL1_0j39NkqtJmI0trHBI1nrRUtfXhuK20zhkJg4Q4rY8GwMpW673KpdvtWFgA3P7Phuua6QMXdlCAyJ3fDDGKiWY4-Y-F9b8XnEyMum40-TCLYALqh0fhc1Xdk5gxa3SlrNNn-aPYVClPPQev8-1Y-d,AVzFdbkXF46wpdgqyZfWZBiUf-71VSZZ8-BCL072IOaldaO8k79YHTBAiYCpR1SKYnxGGETXqrrWOpgn3a-wBMvSL8xGyg5PQHRvqpKU-0NS8Mz6eB9yelKG35kglPPVw7dJR8MUKSu2fC6dmWMsOeZXMW8eRFIMngHv-OIyBeSYvgEJFseY,AVzFdbnN6U9vf2xpG6ExgO95WntO18uBCASxVXMptElZdDBp1NUe7bb5LLU_-ugVppsLi7oE03wKej80yaCc4eMsf6-Dfm5k-rWjcL0egxMsCdOkIxmnr5hUPAQMRa6WAAjwm1Fz7UGxfm9WU1p37Wg2tuzSUG-v34HVNooAAKHeG2hdN0_9}	One of Tel Aviv's most famous beaches, with soft sands and crystal clear waters, ideal for swimming. The beach offers amenities and lifeguards for safety.	\N
179	Dolphin Reef Beach	34.936033	29.5264378	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png	4.4	Dolphin Reef Beach, Eilat, Israel	{AVzFdblr7IaXbY-TXMmQO06RwGKu4gsvDsvm3LTuUkjSpolON9Euf-yptztV72h58Avzaw41JEImCp2i0iy6wuSuSI1PpPpbM_4CCo-4BYhCD1bUy0LIK4y08vPQv11ufwcnlbi7_wOFVE0Sazbe1qE1rMueCs02MAhaEz5psQdfJoxlaCWW,AVzFdbnRXcZryeDlegfsowXo0K19NiiPhoUlA2hXcqcp5gjPEXL0wXf0irFKxjpfvfU6qgUiL4YYH9QIYQ_JS47Bw0H4n0WwctwpNffg0A9yBEI-SmjAnuCqXOe5iWHRxsz8K4dplaXdmjtwFabX0i9TR1rQPpoU8oWjZNSemFnm22rT2duX,AVzFdbkUOw5wOc7Hj4U3c8Y_MEoZVNYnG5UsUWLwwBHUpxmjqKWkMpiSBdjJdDWawnSO0UM20tiGciKWQfssOGKGzD8vsAYk5a1n8PI2kXHMu35yoom4kTyoz67YgoW8kHRG8G3jPV5yvUWqqUfjL5W7ZGGrb23k9P3UyLbUISJeeAERe3TM,AVzFdbnMaEawOPw4IEh9LvjRi9ZTPZej1K2Ed4UOkvVcJXV9OiQoPmY-diN5ht2hd-v8twb0V606gQJkOYDEAuTilaVNXfe6SMbw_xZzp8URRDhpI_MLuB71cLXaa1c2S70E4EmU6r-rhgR-LP5fiuJgPLKb1V1ZRUVc0CAt7KOcCTAEdD7M}	Located in Eilat, this unique location allows visitors to swim with dolphins in a serene environment, perfect for swimming lovers looking for an unforgettable experience.	\N
180	שמורת טבע חוף האלמוגים	34.9210677	29.50794579999999	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png	4.6	שמורת טבע חוף האלמוגים, אילת, Israel	{AVzFdbmDcjiBIPesp0byYj3-m6nUwT4VZvC1CdweOZWHhgyqQBCCnjF6N4KxN2zdKi9hJq9maSEe7WKap7Te5qV2igtdmKfttp7GY06l8n6WOBe-pROg6lE3Q2LHIVB2Ybzmset2DJltM_dbvrLTXBaO8PBF45sjoQ39BAc4O7r6ydBAbH22,AVzFdbl6DQcFlXHb3b4ilkb-ZU9Cz33ju6XyN1pueFvyXW8nZkvQvTz-ZexRMMn08-upOK7zk29uDIh0_Df5QD90s8aymRqhboImi8z_eruIy05hK8wqJp3leXuIWmz3PICtOAppArWn6V2XNypx47rJLdQir_tAm4r6Dt7bvXO7wUOOVR2n,AVzFdbkEA0GLkpoESw2J0qokvqIzL7WvxOgaq-XNuqo22ZLazOcsFYknOCE7KlYFmMDNWYKM2CjSodLn_Ixl4NQhRfqEs69rhJtKOO-G9vveRE5JTcmpKc4iBj5UJbgXCSaSuL6VfrtD6HWtDEUQyxWm6c758J4UcYhLdNgd7AaN0a7qxiku,AVzFdbmhshxp1qhNjmWNrVQdt0n4tFgSu2m1a5H3Yt6ZHoGrBgmWmcwcEfpSCw2flabAonWx5f5v0PeM80GlS0S1JSscdGOjsMlsKC3BAJh9CWVdTh5vaSrhmvfhwjhPpYHFfpULSGpU7EqZDqbVEC3qKlELpHxipOxC8pVTmsTupM0v4w8_}	Eilat's stunning beach full of coral reefs, great for swimming and snorkeling. A calm spot with rich marine life to explore.	\N
181	Hilton Beach	34.7694051	32.0903273	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png	4.5	Hilton Beach, Israel	{AVzFdbkwHqc_jsai_B_CHxa_RRIRbfiwAVWvxiP651p_OOdN5eGGIws98m2kOKQKxYDxm80g_JmdXCWkPRHTMcpudWpsPlcL_hkB1B6K1ierrpFlf6R2UnIreC67ikF2-k1WoeS8S63z6PKVHTKUe7R09vY0a9LMdfxhMdM2XLZe_qeV9oNt,AVzFdbkCvR2YVsZggah2O0Q04c_979SfBHRreMx903Mb6_Zdjl0GQ4XCuXL0_B71Zy_XfpLPkgJWXCTeW_s4qwiKBVh9xoADCvxHknxTVRvYCWboagNO3B7Wh1Q33h3TKqy5n2I_l-35dv0c04xIT9XzyBhX0shIhNQLl53S69ueG7Rbomj7,AVzFdbmXwzTDRU4SR0JpUTdnO6avtO0BpQIYjFYGCXP_kwwlmYmDh3rTQZm2L7YMZ5tZ6IvMZxZayVrLfk1wDA1Yw-FiNLSLXrqULCyYssmwB_WV89ZyyqDTwsoojRHwzzGJIfPRZ8TV_y-xwb6hCvPoLd_i8WdyuUiNM7l33eD0qB7EjoE6,AVzFdbn2nBzQhKUA0cGeGCuAqfiMSSAgtvDvTnEfSzG1eA93R1GnsJFbDabLz8OJeDp5EmsgYKJ2Ewg1ufdEAanK_2LyyFggdSgRkkud4AMBGkLrnezoFR66g5VbLzRbiQf30HafBiROBhKKktFfZcKpwfCazXLsl2lBcQGk0pdBCp0BNSaJ}	Popular beach known for its vibrant atmosphere, ideal for sunbathing and swimming. It has plenty of facilities and nearby cafes.	\N
182	Frishman Beach	34.766799	32.080185	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png	4.6	Frishman Beach, Israel	{AVzFdbkDyf8wmo_SWJQm8f8b7uNWmb7JwfusbMU0fF5cpfyNF5SZHMtuyVAB51LIgtALLgL3kUKRZlCe6t6ruecFkYRQb1crfVPoA5NnJLJYhuembkut50q3Tu6PYMBG-s3OwS9XDOoFwJ1oobYAo9gLxUuZpLGLmKJ6QVte90hFG7gYE4BO,AVzFdblYAhdz88mm_pNAVVG2q68aAJBi89Ziz_v54C6EV2tpdhAtSZ4eGXH2EsO5WztHDJIscDUAFgsNaiYgdg-tgTShc9NQwS9Jd6v1FeYCSuxvvyMVag0Vrvh9BC9L3B6MorcMLsAstma1ZnfkZnQSqSfFl_RBYTbavLN21bUZyVHB5qkZ,AVzFdbkkVl_3Ui6NRZKsMaEW6me_0lqjD5rHaMNnwkYg6_sHuZ09q6D-bZapWpcBwA2JMK6KoCXqKH3T4V4-Q4Ectqj-KDDYjl_gsRx2_9Asp7FiPwbZcs9Bs0wKvgAYU9L4u8vBBXuyi6VGaKhUTpNx79bbKN64VQ_ebsWXQ4JDn2LuWvsf,AVzFdbmaG43YFbzXZ9Sq_qjyxLZCrR8N6bki6eMK3Sxx6vuGLfpZ2amkPHhVKdh4-PnryDv7LdZaXhpoXlse4FvJpOrpXrAHi1DUexlex7pGVViDuPTP7a8TXyCFJvcVsP_dBZE7CWOwhS3JUwyjlYfVbkkpmoLpwJgiZDCPyOdc5GcJevHf}	A lively beach located in the heart of Tel Aviv, perfect for swimming and enjoying various beach activities. Also great for people-watching.	\N
184	Tel Baruch Beach	34.7802935	32.1169081	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png	4.4	Tel Baruch Beach, Israel	{AVzFdbkgXplmQCmVUHjoDuOW5T6bNCM6o4ZGgi6WAAeL5x7sB6o8V-h0PMyEr6POUqLuSJ47jQ1oZaxVqIHKUZE7OeJPSCQaB1YxyfOYR_CD0OSehTzJm-heruUxCPniSSc6W0TlXSkl7WIIk6Ush5ZXkr_vYcTTV-pR-NvnV31YC5q-S_as,AVzFdbkyh7JotTJPhBW9uUUVOZ78oI1SnTgtfCKAfaWNhWlpwokrBhSIBUZUMKR09G17He1KQ_pv7lqmLPEWcjg61LnCFXC71LLu3bri3XtUoNPw_3sP9evETso9x4Mv94a29L1dkNjvzdLQ9c-CWzxB6SunB16zJypSu-8fIIhj6_V5NyxT,AVzFdbkOs087Bgqx2BNmWKMjIzTwcsYcrK8cMhNRhLdHeXmAXKfu1Cyy5UpJ88Y7Zom5ae4gxu08Ns7O5oHYllfxSe9_ptfxl4aSZQFme19ikrAwAUsquqtf-XDhGGx_1AK4zB4APKkaDxapoCrCJ5azq34ZbdVfvddmSF1Zt5niXD4ucJ6c,AVzFdbmy4G90VN-5s3-Ji7kHsNWlolLCNQgOYAV3vL-wacrsg-R7ihq61S8dFo1I6RAJoUmt0LK4tYLa3S65tVLm_ulhIG_cqaxjBJ_lVTYusS6le-YKtMc_g0F_3qBLPM2qgXXEH6wJif4kupy_2Q8lMckbj7PTJuRNruad8r9smbvmGc61}	Family-friendly beach with shallow waters ideal for swimming, featuring playgrounds and picnic areas for a relaxed day.	\N
185	Hilton Beach	34.7694051	32.0903273	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png	4.5	Hilton Beach, Israel	{AVzFdbkwHqc_jsai_B_CHxa_RRIRbfiwAVWvxiP651p_OOdN5eGGIws98m2kOKQKxYDxm80g_JmdXCWkPRHTMcpudWpsPlcL_hkB1B6K1ierrpFlf6R2UnIreC67ikF2-k1WoeS8S63z6PKVHTKUe7R09vY0a9LMdfxhMdM2XLZe_qeV9oNt,AVzFdbkCvR2YVsZggah2O0Q04c_979SfBHRreMx903Mb6_Zdjl0GQ4XCuXL0_B71Zy_XfpLPkgJWXCTeW_s4qwiKBVh9xoADCvxHknxTVRvYCWboagNO3B7Wh1Q33h3TKqy5n2I_l-35dv0c04xIT9XzyBhX0shIhNQLl53S69ueG7Rbomj7,AVzFdbmXwzTDRU4SR0JpUTdnO6avtO0BpQIYjFYGCXP_kwwlmYmDh3rTQZm2L7YMZ5tZ6IvMZxZayVrLfk1wDA1Yw-FiNLSLXrqULCyYssmwB_WV89ZyyqDTwsoojRHwzzGJIfPRZ8TV_y-xwb6hCvPoLd_i8WdyuUiNM7l33eD0qB7EjoE6,AVzFdbn2nBzQhKUA0cGeGCuAqfiMSSAgtvDvTnEfSzG1eA93R1GnsJFbDabLz8OJeDp5EmsgYKJ2Ewg1ufdEAanK_2LyyFggdSgRkkud4AMBGkLrnezoFR66g5VbLzRbiQf30HafBiROBhKKktFfZcKpwfCazXLsl2lBcQGk0pdBCp0BNSaJ}	Popular beach known for its vibrant atmosphere, ideal for sunbathing and swimming. It has plenty of facilities and nearby cafes.	{}
186	Frishman Beach	34.766799	32.080185	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png	4.6	Frishman Beach, Israel	{AVzFdbkDyf8wmo_SWJQm8f8b7uNWmb7JwfusbMU0fF5cpfyNF5SZHMtuyVAB51LIgtALLgL3kUKRZlCe6t6ruecFkYRQb1crfVPoA5NnJLJYhuembkut50q3Tu6PYMBG-s3OwS9XDOoFwJ1oobYAo9gLxUuZpLGLmKJ6QVte90hFG7gYE4BO,AVzFdblYAhdz88mm_pNAVVG2q68aAJBi89Ziz_v54C6EV2tpdhAtSZ4eGXH2EsO5WztHDJIscDUAFgsNaiYgdg-tgTShc9NQwS9Jd6v1FeYCSuxvvyMVag0Vrvh9BC9L3B6MorcMLsAstma1ZnfkZnQSqSfFl_RBYTbavLN21bUZyVHB5qkZ,AVzFdbkkVl_3Ui6NRZKsMaEW6me_0lqjD5rHaMNnwkYg6_sHuZ09q6D-bZapWpcBwA2JMK6KoCXqKH3T4V4-Q4Ectqj-KDDYjl_gsRx2_9Asp7FiPwbZcs9Bs0wKvgAYU9L4u8vBBXuyi6VGaKhUTpNx79bbKN64VQ_ebsWXQ4JDn2LuWvsf,AVzFdbmaG43YFbzXZ9Sq_qjyxLZCrR8N6bki6eMK3Sxx6vuGLfpZ2amkPHhVKdh4-PnryDv7LdZaXhpoXlse4FvJpOrpXrAHi1DUexlex7pGVViDuPTP7a8TXyCFJvcVsP_dBZE7CWOwhS3JUwyjlYfVbkkpmoLpwJgiZDCPyOdc5GcJevHf}	A lively beach located in the heart of Tel Aviv, perfect for swimming and enjoying various beach activities. Also great for people-watching.	{}
187	Tel Baruch Beach	34.7802935	32.1169081	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png	4.4	Tel Baruch Beach, Israel	{AVzFdbkgXplmQCmVUHjoDuOW5T6bNCM6o4ZGgi6WAAeL5x7sB6o8V-h0PMyEr6POUqLuSJ47jQ1oZaxVqIHKUZE7OeJPSCQaB1YxyfOYR_CD0OSehTzJm-heruUxCPniSSc6W0TlXSkl7WIIk6Ush5ZXkr_vYcTTV-pR-NvnV31YC5q-S_as,AVzFdbkyh7JotTJPhBW9uUUVOZ78oI1SnTgtfCKAfaWNhWlpwokrBhSIBUZUMKR09G17He1KQ_pv7lqmLPEWcjg61LnCFXC71LLu3bri3XtUoNPw_3sP9evETso9x4Mv94a29L1dkNjvzdLQ9c-CWzxB6SunB16zJypSu-8fIIhj6_V5NyxT,AVzFdbkOs087Bgqx2BNmWKMjIzTwcsYcrK8cMhNRhLdHeXmAXKfu1Cyy5UpJ88Y7Zom5ae4gxu08Ns7O5oHYllfxSe9_ptfxl4aSZQFme19ikrAwAUsquqtf-XDhGGx_1AK4zB4APKkaDxapoCrCJ5azq34ZbdVfvddmSF1Zt5niXD4ucJ6c,AVzFdbmy4G90VN-5s3-Ji7kHsNWlolLCNQgOYAV3vL-wacrsg-R7ihq61S8dFo1I6RAJoUmt0LK4tYLa3S65tVLm_ulhIG_cqaxjBJ_lVTYusS6le-YKtMc_g0F_3qBLPM2qgXXEH6wJif4kupy_2Q8lMckbj7PTJuRNruad8r9smbvmGc61}	Family-friendly beach with shallow waters ideal for swimming, featuring playgrounds and picnic areas for a relaxed day.	{}
188	Tokyo National Museum	139.7765215	35.7188351	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/museum-71.png	4.5	13-9 Uenokōen, Taito City, Tokyo 110-8712, Japan	{AVzFdblV0L347ksD8ah58UXDf7EOtnfvHit8-CmtmhVsgryF6u5O1A-pjaPAhy8N7WnqZdfgPpD25NlIlG4_9AL_FxRkvQweRJRy2lf-LNdjBr6Zf4pJ0xQlXzSNFmeEQKH3GeB8t6VQz8QKX82i74hHVUMq21pqDynhdiHmtndL4_EqiagW,AVzFdbka06j890WF2UDZOZogMA183E0ZTt4H3qTlt-i8DXvIHnseh6XtABSmNewc6FVx-0hji_Q86Vh_waMsmW-iTFWxzE8Bw6awS4FmXnGGlzDiWb9fwEmdyEo6zVks3fzzVfX63kJPAyJCXWZkkMfaAO1EhkmqneJEBoItYMQH6Rkq0xrn,AVzFdbke4cKZvJCaoCl4vIyh2cgLeJRme7vglH4Oko2KsCpu53KC3U4s1NQVMsYdSE-mzpCXVsPofeChnhzJ-Hwh39jYJxFBGRi9ixafjcU2YfoEDs2sA_lP_avEnllqeZOs8sBSjaTHIfmaH19u-o6PYQcvCc8Kdcb3wJbkhyJY5P4MDv8g,AVzFdbkI868P1EOTMdrC7LL6KPcd9Q6ICQ4y8mckxeC8gXHl3qwkM553duOhTbjUn6Q8MBq54MSjd-1L7GAaQV2EIcfme7Dtv6AKAEfVfCEKIyeSSwoIjACC0BGwkejiV-t3-QsXxZmn9G-2gbvzW3sLUzfj3Up2AYo3PnPBw6nqRhCa9T_4}	Japan’s oldest and largest museum, showcasing a vast collection of art and antiquities from Japan and other Asian countries.	\N
189	Mori Art Museum	139.7292785	35.6604621	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/museum-71.png	4.3	Japan, 〒106-6150 Tokyo, Minato City, Roppongi, 6-chōme−10−１, Roppongi Hills Mori Tower, 53階	{AVzFdbnZj60PLlJ28AnVx5sSjFw9NFZAPUg0MiHxPKxNjt35upjpspu1c_LzE4czfsZ-fQ7ziKabVBMyYZjgmVhAwpsRZysu_eNWbYX9nrfcEXqEdqZWzzEubEwfDFxrqXIAuquPxt59sozwfiW2tSQS7iTW5gmHwLWHM75hF4qjRqrydJSU,AVzFdbkAi8nIXN1AdS0l-RNaywlqNwEkGp2n02zE9lIP3lhTc9sUUC2_qed3kHpxYnBBfEZydnQDsWbTW53RvrTUOQkXrWaFaqNbE4qjZYMcp-lhkaeT7qY6jZondRLViGwi9hPSGAMe6SlWcLghDlquO2zjF50kmCg6CM_aqmPYJAGAJ8Wj,AVzFdbkODPQiVHawOiZlFHLoHglNfYTFMNhLRbICu3d4-UEdO86BmgHX0Wo07WW4RFloGdNp62Uu0TCV9HPPC8UZqTmJUGikqiiXvi-jgibFOfnnRIifRWV_1mqP1vY80UvDS9106y1wj549gemxvUmAsIpEPbN82ubKC9Q2IvCBFYVfFRVY,AVzFdbnlaDSTNz_Mwul5Jebd1lGj1iYYtxYY93DN5oKdJikKm3ccJYDnjuUgc2QThzrAyNKg3LU25eNiteODvEDGqFem1JP2rm60xVq7n10boErf_0p_59VxGHoAHWp-lX6zBXQAs0kqZiYQCoy6H9I5rhjyrX0eCDhwtpH71IVI6rRIcCYd}	A contemporary art museum located in Roppongi Hills, focusing on art and design from Japan and elsewhere in Asia with rotating exhibitions.	\N
190	Edo-Tokyo Museum	139.7957336	35.6965972	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/museum-71.png	4.4	1-chōme-4-1 Yokoami, Sumida City, Tokyo 130-0015, Japan	{AVzFdbnSWY9vejtjQxcYaIQ5CYAyVG8EoRDoDeV80WGeTVlcOmUlJ79fSwNviTFLJ7AZgKapeKzwFifalxB2xBREtNa2d6O_w5zeH1U5nApIvZ88y_R9On1KcBVx73Zjc386G6Bgi7Pqese3KPLcT4XAHRSyhPSD1iIMQqHMR6coZpMraAZ0,AVzFdbkckJoHvtbcZLL8s0Y2Lm2BfZeETtE7_5TVdpyyYfmhRAzwK8cduHlbSEtq3GnB0QrCQJamoPszgl6hqOd3lQggCI_t2-MdnAgfiqKJgOvYQ73y6zor9VH6lCfiTWQz5QociZn62uDkCGxtpE_EMxkur0sqqcfXb-trLSc9gxQn4Y4T,AVzFdbmrprHG_EQCAPW-7y4NqPQ7IjpCmh420tjnNqcakYYQsytNoGPAto9MdqnDkfbBbq2K2sYpLUt6VdWUQlCAzCh-ss4vhcWp2A4qbZp22NViowg8ySJm1tz7Dg2es98jhS9frElSl0UIO5h8d2TuLOdKaqxhEQIBQDST2t9Ij4Y6VL0E,AVzFdbkx8kh_DXUpSABwQhA_SQTn8JqZZLuPwcClPMzSbJs0l-SfvjVWmuyStJ43S6FHGJP4ggKSuwwfAa76vQ6PQ8Qmi62-qdVxaauAbhv8aAJl6Hr6Uhrpb4xSPMiTd69Te5ACpjh1Z7K6cdvHL2y3lBt2NFK9L11sP-kKvyRoS7NaiXOH}	Offers a fascinating insight into Tokyo’s transformation from the Edo period to modern times, with engaging exhibits and scale models.	\N
191	National Museum of Nature and Science	139.7763336	35.7164273	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/museum-71.png	4.5	7-20 Uenokōen, Taito City, Tokyo 110-8718, Japan	{AVzFdbmHX6J9ejt3G3-EvcPWjcqLZLxKI9GFcRZDP_wPGz1ipzMbLeeqVGqwLEicDR58wTcfMHFpEMiu7TXrKQCaFtRx9FffNVprrCTKCqRQBt8z1tGdthtSYV3LiUPnxjNDlu7QvKHnyq7tFfJ6zXPtI7kXlXvvmiIrAdbxtykQrPNHtz_G,AVzFdbk1nbTokY1b_t0mExI2-2Zr3Pwe6dtUJdMRVHNCU6h_H5p8uKLC796fQ644BzlZSrwl595QoqsdXGGGsM7_X-mt3IxStMCodj1dRp5YgwPN5xD_8d7fFgUG3762rKbuEqKW3-Agn4QPqrjMMrLSxZ9KnKIcdyMYqJtMYBdO3Z0o8Avi,AVzFdblwwYyZoZC3l02i2tVg5xImzA8p0GCUdv7GJb5PilGEEMf4KxGRWo8dB2-nl9NYYZkw8LFksKliWnwSxNvntDWLH3KkKWDKZA-dtDPNKpcWjjGhzyrCZJZ0d_Yo8VwAOOxDPP-A2raesdqax3Fkt9EEMCPBw9MF5RC1nh_v9jUFB3QD,AVzFdbnTN9K07ZNa9jdpP-J68Fm-SzpDxi-UlFTKjCyY_wO9NfanAVbaV7Pm465Wtrzoe9rVcwJpVwtoY_Ih8D_DanX2aLBfHhazsxP0DF8A9EwceXfqypK2wgVCbRZ7R909LwWq2SGWWUIgGlPQdYohCQz8V4vFELWlBcigimt-q3epLS9p}	This museum covers a wide range of topics including nature, science, and technology, and features a hands-on experience area.	\N
192	The Sumida Hokusai Museum	139.800414	35.6963313	https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/museum-71.png	4.1	2-chōme-7-2 Kamezawa, Sumida City, Tokyo 130-0014, Japan	{AVzFdbkk2JPvFmahXk5wyHTRgFcDCpaIstVmbCXYWF80-RVwQ9iFeEcdgAJ1rGs5fcCfSCfSWTqfBLF-NI-CB_VZ7tlcZ-ipwvlp3bQHiFq-pYPDAR8CVnyehjFV5oxs9rVNtEOgEJB5aj2rjGUWfkUQyoOiDvSbql-jWqCmFDn4vuBwAL2E,AVzFdbnSqmqzpLKOFHwZOPEaUW28Ixh1JfSHKImWhmRyTw6o-zIlREKR6ZiXHOEU0zmCYaqfWNJ_QkXhByF5oz6fQXCm_QMCOBgy-5U-rAXBRh29dmu7rYdAtqvJcRrUU0Rbf-KZlw2MiYTxb63n29VFbAxTLG4sfltx5n1-IxMzwwGObQMi,AVzFdbkihnyhMidINRzz0_Sqr0SanhYlQdJnv7BdDMeTcbm6NYc7wvBqoAxuWHjyj9DJVRyfkBXmWAv4lRYdZ_cR7bQxhEHrO1D-C0n_bkJV6Q3j-ofbWr50l91Pb76dygTGy3E-pCGjAgStWYVngy4iMs5-3pY54eC7SDeuBC_45sxHhSye,AVzFdbkyRTR4tW7puB9cMDduJBYqx_g7ZA5seL0zh0NToREka6OGTbK9jEchQTtHIgL2XkmwlqgvJWJghvjpIlo4nwSau2PflOfiw8K1zXBiITMFD3-DPfr5ODnrV8VMF9nCsKOvJ147Zk7vDL4WPl9YoMJwOVhDhn5-sUh_7-V9kHXTpXar}	Dedicated to the famous ukiyo-e artist Katsushika Hokusai, showcasing his artwork and the impact he had on art and culture.	\N
\.


--
-- Data for Name: routes; Type: TABLE DATA; Schema: public; Owner: trip_me_up_db_user
--

COPY public.routes (id, user_id, start_date, end_date, places) FROM stdin;
33	10	\N	\N	{162,163,164,165,166}
34	10	\N	\N	{167,168,169,170}
35	10	\N	\N	{171,172,173,174,175}
36	45	\N	\N	{176,177,178,179,180}
37	10	\N	\N	{185,186,187}
38	10	\N	\N	{188,189,190,191,192}
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: trip_me_up_db_user
--

COPY public.users (id, name, email, username, password) FROM stdin;
10	bob jobs	google@google.com	cooluser	$2b$10$vb3Cc01PDwfH2.j3w2r0O.IZ888X9/VqGFJGuSypu9czeBTFn3aOG
12	Lior	test@test.com	deadecho	$2b$10$VI09cbWEsmmNtlhdp8sWEOrr5KTEA2K8pZxi5opYHYCTBm9UDbVaG
30	bob jobs	account@google.com	main	$2b$10$hAQU8kjM5qboVIa4jL79nOeiMiB4.HRESaR871cKMA/LKDXCxoXoa
32	boby boten	good@google.com	anothermain	$2b$10$BdQPK6ygEq9HPhIniXB36uQ2cM2PMuU91scN4naU/3MMOyczve6bi
36	boby fish	myaccount@google.com	yetAnother	$2b$10$kKbNuY9jVar.HrD0CD.TGeFVoYBYxCJyZplDiX4RC900bO6CJBkuu
43	lior	test2@test.com	deadecho	$2b$10$zA66zPkGobhzv8mxvf0fUuxdhwCSfnTgJq2/nBAOSTMhrhVjgv63G
44	Lior	test3@test.com	poopy	$2b$10$ELouY72cu/2s4VA1tys95.gYcFGYMkPpLx6IIHtU0YAts9bhx2GIG
45	asd	asd@test.com	lior	$2b$10$Q1r67fKgUTFalUDO6shOZOMVTlXxiW8Re9R9LAzi0q/VV7qtyI8Gu
\.


--
-- Name: place_id_seq; Type: SEQUENCE SET; Schema: public; Owner: trip_me_up_db_user
--

SELECT pg_catalog.setval('public.place_id_seq', 192, true);


--
-- Name: routes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: trip_me_up_db_user
--

SELECT pg_catalog.setval('public.routes_id_seq', 38, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: trip_me_up_db_user
--

SELECT pg_catalog.setval('public.users_id_seq', 45, true);


--
-- Name: place place_pkey; Type: CONSTRAINT; Schema: public; Owner: trip_me_up_db_user
--

ALTER TABLE ONLY public.place
    ADD CONSTRAINT place_pkey PRIMARY KEY (id);


--
-- Name: routes routes_pkey; Type: CONSTRAINT; Schema: public; Owner: trip_me_up_db_user
--

ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: trip_me_up_db_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: trip_me_up_db_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: routes routes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trip_me_up_db_user
--

ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO trip_me_up_db_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO trip_me_up_db_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO trip_me_up_db_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO trip_me_up_db_user;


--
-- PostgreSQL database dump complete
--

