PGDMP                     	    {            marketstallrentalsdb    15.2    15.2                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    22672    marketstallrentalsdb    DATABASE     �   CREATE DATABASE marketstallrentalsdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
 $   DROP DATABASE marketstallrentalsdb;
                postgres    false                        2615    22673    dbo    SCHEMA        CREATE SCHEMA dbo;
    DROP SCHEMA dbo;
                postgres    false            �            1255    22674    usp_reset() 	   PROCEDURE     �  CREATE PROCEDURE dbo.usp_reset()
    LANGUAGE plpgsql
    AS $$
begin

	DELETE FROM dbo."Vaccination";
	DELETE FROM dbo."Vaccine";
	DELETE FROM dbo."People";
	DELETE FROM dbo."HealthCenter";
	DELETE FROM dbo."Users";
	
	ALTER SEQUENCE dbo."HealthCenter_HealthCenterId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."People_PeopleId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Users_UserId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Vaccination_Vaccination_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Vaccine_VaccineId_seq" RESTART WITH 1;
	
	INSERT INTO dbo."Users" (
		"MobileNumber", 
		"Password", 
		"Name", 
		"UserType")
	VALUES (
			'123456',
			'ODc4NzM4MGRlYWQ2ZGJmN2JiNjU0MmI3M2E2YmVmOWU=', 
			'Admin',  
			'ADMIN');
END;
$$;
     DROP PROCEDURE dbo.usp_reset();
       dbo          postgres    false    6            �            1259    22689    SystemConfig    TABLE     r   CREATE TABLE dbo."SystemConfig" (
    "Key" character varying NOT NULL,
    "Value" character varying NOT NULL
);
    DROP TABLE dbo."SystemConfig";
       dbo         heap    postgres    false    6            �            1259    22694    Users    TABLE       CREATE TABLE dbo."Users" (
    "UserId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "MobileNumber" character varying NOT NULL,
    "Password" character varying NOT NULL,
    "UserType" character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
    DROP TABLE dbo."Users";
       dbo         heap    postgres    false    6            �            1259    22700    Users_UserId_seq    SEQUENCE     �   ALTER TABLE dbo."Users" ALTER COLUMN "UserId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Users_UserId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    216            �          0    22689    SystemConfig 
   TABLE DATA           5   COPY dbo."SystemConfig" ("Key", "Value") FROM stdin;
    dbo          postgres    false    215   �                  0    22694    Users 
   TABLE DATA           b   COPY dbo."Users" ("UserId", "Name", "MobileNumber", "Password", "UserType", "Active") FROM stdin;
    dbo          postgres    false    216                     0    0    Users_UserId_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dbo."Users_UserId_seq"', 1, true);
          dbo          postgres    false    217            m           2606    22720    SystemConfig SystemConfig_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY dbo."SystemConfig"
    ADD CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("Key");
 I   ALTER TABLE ONLY dbo."SystemConfig" DROP CONSTRAINT "SystemConfig_pkey";
       dbo            postgres    false    215            o           2606    22726    Users pk_users_1557580587 
   CONSTRAINT     \   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT pk_users_1557580587 PRIMARY KEY ("UserId");
 B   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT pk_users_1557580587;
       dbo            postgres    false    216            p           1259    22729    u_user    INDEX     j   CREATE UNIQUE INDEX u_user ON dbo."Users" USING btree ("MobileNumber", "Active") WHERE ("Active" = true);
    DROP INDEX dbo.u_user;
       dbo            postgres    false    216    216    216            �   !   x�s�s�w�wq�44261����� V:�          Q   x�3�tL����442615������ʮ�q��ʈr�4�u�ʎ��Ȋ�ʮ�̍���4����tt����,����� >��     