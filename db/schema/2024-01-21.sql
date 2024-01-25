PGDMP                          |            marketstallrentalsdb    15.4    15.4 a    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    80626    marketstallrentalsdb    DATABASE     �   CREATE DATABASE marketstallrentalsdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
 $   DROP DATABASE marketstallrentalsdb;
                postgres    false                        2615    80627    dbo    SCHEMA        CREATE SCHEMA dbo;
    DROP SCHEMA dbo;
                postgres    false            �            1255    80628    usp_reset() 	   PROCEDURE     �  CREATE PROCEDURE dbo.usp_reset()
    LANGUAGE plpgsql
    AS $_$
begin

	DELETE FROM dbo."TenantRentContract";
	DELETE FROM dbo."TenantRentBooking";
	DELETE FROM dbo."StallRate";
	DELETE FROM dbo."Stalls";
	DELETE FROM dbo."StallClassifications";
	DELETE FROM dbo."GatewayConnectedUsers";
	DELETE FROM dbo."Notifications";
	DELETE FROM dbo."UserProfilePic";
	DELETE FROM dbo."Files";
	DELETE FROM dbo."Users";
	DELETE FROM dbo."Access";
	
	ALTER SEQUENCE dbo."TenantRentContracts_TenantRentContractId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."TenantRentBooking_TenantRentBookingId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Stalls_StallId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."StallClassifications_StallClassificationId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."GatewayConnectedUsers_Id_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Notifications_NotificationId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Users_UserId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Access_AccessId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Files_FileId_seq" RESTART WITH 1;
	
	
	INSERT INTO dbo."Access" (
		"AccessCode",
		"Name", 
		"Active",
		"AccessPages"
	)
	VALUES (
			'000001',
			'Admin',
			true,
			'[
      {
        "page": "Dashboard",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Tenant Rent Booking",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Stalls",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Stall Classifications",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Users",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Access",
        "view": true,
        "modify": true,
        "rights": []
      }
    ]');
	
	INSERT INTO dbo."Users" (
		"UserCode",
		"UserName",
		"Password", 
		"FullName",
		"Gender",
		"BirthDate",
		"MobileNumber",
		"AccessGranted",
		"AccessId",
		"UserType")
	VALUES (
			'000001',
			'admin',
			'$2b$10$LqN3kzfgaYnP5PfDZFfT4edUFqh5Lu7amIxeDDDmu/KEqQFze.p8a',  
			'Admin Admin',
			'GENDER',
			'1998-07-18',
			'123456',
			true,
			1,
			'STAFF');
	
END;
$_$;
     DROP PROCEDURE dbo.usp_reset();
       dbo          postgres    false    6            �            1259    80629    Access    TABLE     �   CREATE TABLE dbo."Access" (
    "AccessId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "AccessPages" json DEFAULT '[]'::json NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "AccessCode" character varying
);
    DROP TABLE dbo."Access";
       dbo         heap    postgres    false    6            �            1259    80636    Access_AccessId_seq    SEQUENCE     �   ALTER TABLE dbo."Access" ALTER COLUMN "AccessId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Access_AccessId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    215            �            1259    81672    ContractBilling    TABLE     �  CREATE TABLE dbo."ContractBilling" (
    "ContractBillingId" bigint NOT NULL,
    "ContractBillingCode" character varying,
    "TenantRentContractId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "DateCreated" date DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "DueDate" date DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "BillAmount" numeric DEFAULT 0 NOT NULL,
    "OtherCharges" numeric DEFAULT 0 NOT NULL,
    "TotalBillAmount" numeric DEFAULT 0 NOT NULL,
    "PaymentAmount" numeric DEFAULT 0 NOT NULL,
    "AssignedCollectorId" bigint NOT NULL,
    "Status" character varying DEFAULT 'PENDING'::character varying NOT NULL,
    "UserId" bigint NOT NULL
);
 "   DROP TABLE dbo."ContractBilling";
       dbo         heap    postgres    false    6            �            1259    81671 %   ContractBilling_ContractBillingId_seq    SEQUENCE     �   ALTER TABLE dbo."ContractBilling" ALTER COLUMN "ContractBillingId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."ContractBilling_ContractBillingId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    238    6            �            1259    81702    ContractPayment    TABLE       CREATE TABLE dbo."ContractPayment" (
    "ContractPaymentId" bigint NOT NULL,
    "ContractPaymentCode" character varying,
    "ContractBillingId" bigint NOT NULL,
    "DateCreated" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "DatePaid" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "TotalBillAmount" numeric DEFAULT 0 NOT NULL,
    "PaymentAmount" numeric DEFAULT 0 NOT NULL,
    "Status" character varying NOT NULL,
    "UserId" bigint NOT NULL
);
 "   DROP TABLE dbo."ContractPayment";
       dbo         heap    postgres    false    6            �            1259    81701 %   ContractPayment_ContractPaymentId_seq    SEQUENCE     �   ALTER TABLE dbo."ContractPayment" ALTER COLUMN "ContractPaymentId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."ContractPayment_ContractPaymentId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    240    6            �            1259    81574    Files    TABLE     i   CREATE TABLE dbo."Files" (
    "FileId" bigint NOT NULL,
    "FileName" text NOT NULL,
    "Url" text
);
    DROP TABLE dbo."Files";
       dbo         heap    postgres    false    6            �            1259    81573    Files_FileId_seq    SEQUENCE     �   ALTER TABLE dbo."Files" ALTER COLUMN "FileId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Files_FileId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    229    6            �            1259    81520    GatewayConnectedUsers    TABLE     �   CREATE TABLE dbo."GatewayConnectedUsers" (
    "Id" bigint NOT NULL,
    "SocketId" character varying(100) NOT NULL,
    "UserId" bigint NOT NULL
);
 (   DROP TABLE dbo."GatewayConnectedUsers";
       dbo         heap    postgres    false    6            �            1259    81519    GatewayConnectedUsers_Id_seq    SEQUENCE     �   ALTER TABLE dbo."GatewayConnectedUsers" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."GatewayConnectedUsers_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    223            �            1259    80751    Notifications    TABLE     �  CREATE TABLE dbo."Notifications" (
    "NotificationId" bigint NOT NULL,
    "Title" character varying NOT NULL,
    "Description" character varying NOT NULL,
    "Type" character varying NOT NULL,
    "ReferenceId" character varying NOT NULL,
    "IsRead" boolean DEFAULT false NOT NULL,
    "UserId" bigint NOT NULL,
    "Date" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL
);
     DROP TABLE dbo."Notifications";
       dbo         heap    postgres    false    6            �            1259    80758     Notifications_NotificationId_seq    SEQUENCE     �   ALTER TABLE dbo."Notifications" ALTER COLUMN "NotificationId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Notifications_NotificationId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    217    6            �            1259    81653    RentContractHistory    TABLE     �  CREATE TABLE dbo."RentContractHistory" (
    "RentContractHistoryId" bigint NOT NULL,
    "TenantRentContractId" bigint NOT NULL,
    "DateChanged" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "Date" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "DateRenew" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "StallRentAmount" numeric DEFAULT 0 NOT NULL,
    "OtherCharges" numeric DEFAULT 0 NOT NULL,
    "TotalRentAmount" numeric DEFAULT 0 NOT NULL,
    "Status" character varying NOT NULL,
    "RenewStatus" character varying NOT NULL
);
 &   DROP TABLE dbo."RentContractHistory";
       dbo         heap    postgres    false    6            �            1259    81652 -   RentContractHistory_RentContractHistoryId_seq    SEQUENCE       ALTER TABLE dbo."RentContractHistory" ALTER COLUMN "RentContractHistoryId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."RentContractHistory_RentContractHistoryId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    236    6            �            1259    81535    StallClassifications    TABLE     �  CREATE TABLE dbo."StallClassifications" (
    "StallClassificationId" bigint NOT NULL,
    "StallClassificationsCode" character varying,
    "Name" character varying NOT NULL,
    "Location" character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "DateAdded" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "DateLastUpdated" timestamp with time zone,
    "thumbnailFileId" bigint
);
 '   DROP TABLE dbo."StallClassifications";
       dbo         heap    postgres    false    6            �            1259    81534 .   StallClassifications_StallClassificationId_seq    SEQUENCE     	  ALTER TABLE dbo."StallClassifications" ALTER COLUMN "StallClassificationId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."StallClassifications_StallClassificationId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    225    6            �            1259    81767 	   StallRate    TABLE     �   CREATE TABLE dbo."StallRate" (
    "StallId" bigint NOT NULL,
    "RateCode" character varying NOT NULL,
    "StallRentAmount" numeric DEFAULT 0 NOT NULL
);
    DROP TABLE dbo."StallRate";
       dbo         heap    postgres    false    6            �            1259    81544    Stalls    TABLE     v  CREATE TABLE dbo."Stalls" (
    "StallId" bigint NOT NULL,
    "StallCode" character varying,
    "Name" character varying NOT NULL,
    "StallClassificationId" bigint NOT NULL,
    "AreaName" character varying NOT NULL,
    "Status" character varying DEFAULT 'AVAILABLE'::character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "DateAdded" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "DateLastUpdated" timestamp with time zone,
    "MonthlyRate" numeric DEFAULT 0 NOT NULL,
    "WeeklyRate" numeric DEFAULT 0 NOT NULL,
    "DailyRate" numeric DEFAULT 0 NOT NULL
);
    DROP TABLE dbo."Stalls";
       dbo         heap    postgres    false    6            �            1259    81543    Stalls_StallId_seq    SEQUENCE     �   ALTER TABLE dbo."Stalls" ALTER COLUMN "StallId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Stalls_StallId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    227    6            �            1259    80789    SystemConfig    TABLE     r   CREATE TABLE dbo."SystemConfig" (
    "Key" character varying NOT NULL,
    "Value" character varying NOT NULL
);
    DROP TABLE dbo."SystemConfig";
       dbo         heap    postgres    false    6            �            1259    81602    TenantRentBooking    TABLE       CREATE TABLE dbo."TenantRentBooking" (
    "TenantRentBookingId" bigint NOT NULL,
    "TenantRentBookingCode" character varying,
    "RequestedByUserId" bigint NOT NULL,
    "StallId" bigint NOT NULL,
    "DateCreated" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "DateLastUpdated" timestamp with time zone,
    "DatePreferedStart" date DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "Status" character varying DEFAULT 'PENDING'::character varying NOT NULL
);
 $   DROP TABLE dbo."TenantRentBooking";
       dbo         heap    postgres    false    6            �            1259    81601 )   TenantRentBooking_TenantRentBookingId_seq    SEQUENCE     �   ALTER TABLE dbo."TenantRentBooking" ALTER COLUMN "TenantRentBookingId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."TenantRentBooking_TenantRentBookingId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    232            �            1259    81629    TenantRentContract    TABLE     c  CREATE TABLE dbo."TenantRentContract" (
    "TenantRentContractId" bigint NOT NULL,
    "TenantRentContractCode" character varying,
    "TenantUserId" bigint NOT NULL,
    "StallId" bigint NOT NULL,
    "DateCreated" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "DateLastUpdated" timestamp with time zone,
    "DateStart" date DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "DateRenew" timestamp with time zone,
    "StallRentAmount" numeric DEFAULT 0 NOT NULL,
    "OtherCharges" numeric DEFAULT 0 NOT NULL,
    "TotalRentAmount" numeric DEFAULT 0 NOT NULL,
    "Status" character varying DEFAULT 'ACTIVE'::character varying NOT NULL,
    "RenewStatus" character varying,
    "StallRateCode" character varying NOT NULL,
    "CurrentDueDate" date DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL
);
 %   DROP TABLE dbo."TenantRentContract";
       dbo         heap    postgres    false    6            �            1259    81628 ,   TenantRentContracts_TenantRentContractId_seq    SEQUENCE       ALTER TABLE dbo."TenantRentContract" ALTER COLUMN "TenantRentContractId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."TenantRentContracts_TenantRentContractId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    234            �            1259    81581    UserProfilePic    TABLE     b   CREATE TABLE dbo."UserProfilePic" (
    "UserId" bigint NOT NULL,
    "FileId" bigint NOT NULL
);
 !   DROP TABLE dbo."UserProfilePic";
       dbo         heap    postgres    false    6            �            1259    80794    Users    TABLE     W  CREATE TABLE dbo."Users" (
    "UserId" bigint NOT NULL,
    "UserName" character varying NOT NULL,
    "Password" character varying NOT NULL,
    "FullName" character varying NOT NULL,
    "Gender" character varying DEFAULT 'Others'::character varying NOT NULL,
    "BirthDate" date NOT NULL,
    "MobileNumber" character varying NOT NULL,
    "AccessGranted" boolean NOT NULL,
    "AccessId" bigint,
    "Active" boolean DEFAULT true NOT NULL,
    "UserCode" character varying,
    "Address" character varying DEFAULT 'NA'::character varying NOT NULL,
    "UserType" character varying NOT NULL
);
    DROP TABLE dbo."Users";
       dbo         heap    postgres    false    6            �            1259    80802    Users_UserId_seq    SEQUENCE     �   ALTER TABLE dbo."Users" ALTER COLUMN "UserId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Users_UserId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    220            �          0    80629    Access 
   TABLE DATA           Z   COPY dbo."Access" ("AccessId", "Name", "AccessPages", "Active", "AccessCode") FROM stdin;
    dbo          postgres    false    215   c�       �          0    81672    ContractBilling 
   TABLE DATA           �   COPY dbo."ContractBilling" ("ContractBillingId", "ContractBillingCode", "TenantRentContractId", "Name", "DateCreated", "DueDate", "BillAmount", "OtherCharges", "TotalBillAmount", "PaymentAmount", "AssignedCollectorId", "Status", "UserId") FROM stdin;
    dbo          postgres    false    238   �       �          0    81702    ContractPayment 
   TABLE DATA           �   COPY dbo."ContractPayment" ("ContractPaymentId", "ContractPaymentCode", "ContractBillingId", "DateCreated", "DatePaid", "TotalBillAmount", "PaymentAmount", "Status", "UserId") FROM stdin;
    dbo          postgres    false    240   0�       �          0    81574    Files 
   TABLE DATA           ;   COPY dbo."Files" ("FileId", "FileName", "Url") FROM stdin;
    dbo          postgres    false    229   M�       �          0    81520    GatewayConnectedUsers 
   TABLE DATA           J   COPY dbo."GatewayConnectedUsers" ("Id", "SocketId", "UserId") FROM stdin;
    dbo          postgres    false    223   ��       �          0    80751    Notifications 
   TABLE DATA           �   COPY dbo."Notifications" ("NotificationId", "Title", "Description", "Type", "ReferenceId", "IsRead", "UserId", "Date") FROM stdin;
    dbo          postgres    false    217   �       �          0    81653    RentContractHistory 
   TABLE DATA           �   COPY dbo."RentContractHistory" ("RentContractHistoryId", "TenantRentContractId", "DateChanged", "Date", "DateRenew", "StallRentAmount", "OtherCharges", "TotalRentAmount", "Status", "RenewStatus") FROM stdin;
    dbo          postgres    false    236   7�       �          0    81535    StallClassifications 
   TABLE DATA           �   COPY dbo."StallClassifications" ("StallClassificationId", "StallClassificationsCode", "Name", "Location", "Active", "DateAdded", "DateLastUpdated", "thumbnailFileId") FROM stdin;
    dbo          postgres    false    225   T�       �          0    81767 	   StallRate 
   TABLE DATA           L   COPY dbo."StallRate" ("StallId", "RateCode", "StallRentAmount") FROM stdin;
    dbo          postgres    false    241   ��       �          0    81544    Stalls 
   TABLE DATA           �   COPY dbo."Stalls" ("StallId", "StallCode", "Name", "StallClassificationId", "AreaName", "Status", "Active", "DateAdded", "DateLastUpdated", "MonthlyRate", "WeeklyRate", "DailyRate") FROM stdin;
    dbo          postgres    false    227   �       �          0    80789    SystemConfig 
   TABLE DATA           5   COPY dbo."SystemConfig" ("Key", "Value") FROM stdin;
    dbo          postgres    false    219   ��       �          0    81602    TenantRentBooking 
   TABLE DATA           �   COPY dbo."TenantRentBooking" ("TenantRentBookingId", "TenantRentBookingCode", "RequestedByUserId", "StallId", "DateCreated", "DateLastUpdated", "DatePreferedStart", "Status") FROM stdin;
    dbo          postgres    false    232   ��       �          0    81629    TenantRentContract 
   TABLE DATA           &  COPY dbo."TenantRentContract" ("TenantRentContractId", "TenantRentContractCode", "TenantUserId", "StallId", "DateCreated", "DateLastUpdated", "DateStart", "DateRenew", "StallRentAmount", "OtherCharges", "TotalRentAmount", "Status", "RenewStatus", "StallRateCode", "CurrentDueDate") FROM stdin;
    dbo          postgres    false    234   ��       �          0    81581    UserProfilePic 
   TABLE DATA           ;   COPY dbo."UserProfilePic" ("UserId", "FileId") FROM stdin;
    dbo          postgres    false    230   �       �          0    80794    Users 
   TABLE DATA           �   COPY dbo."Users" ("UserId", "UserName", "Password", "FullName", "Gender", "BirthDate", "MobileNumber", "AccessGranted", "AccessId", "Active", "UserCode", "Address", "UserType") FROM stdin;
    dbo          postgres    false    220   2�       �           0    0    Access_AccessId_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('dbo."Access_AccessId_seq"', 1, true);
          dbo          postgres    false    216            �           0    0 %   ContractBilling_ContractBillingId_seq    SEQUENCE SET     S   SELECT pg_catalog.setval('dbo."ContractBilling_ContractBillingId_seq"', 1, false);
          dbo          postgres    false    237            �           0    0 %   ContractPayment_ContractPaymentId_seq    SEQUENCE SET     S   SELECT pg_catalog.setval('dbo."ContractPayment_ContractPaymentId_seq"', 1, false);
          dbo          postgres    false    239            �           0    0    Files_FileId_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dbo."Files_FileId_seq"', 4, true);
          dbo          postgres    false    228            �           0    0    GatewayConnectedUsers_Id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('dbo."GatewayConnectedUsers_Id_seq"', 1, false);
          dbo          postgres    false    222            �           0    0     Notifications_NotificationId_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('dbo."Notifications_NotificationId_seq"', 1, false);
          dbo          postgres    false    218            �           0    0 -   RentContractHistory_RentContractHistoryId_seq    SEQUENCE SET     [   SELECT pg_catalog.setval('dbo."RentContractHistory_RentContractHistoryId_seq"', 1, false);
          dbo          postgres    false    235            �           0    0 .   StallClassifications_StallClassificationId_seq    SEQUENCE SET     [   SELECT pg_catalog.setval('dbo."StallClassifications_StallClassificationId_seq"', 4, true);
          dbo          postgres    false    224            �           0    0    Stalls_StallId_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('dbo."Stalls_StallId_seq"', 1, true);
          dbo          postgres    false    226            �           0    0 )   TenantRentBooking_TenantRentBookingId_seq    SEQUENCE SET     V   SELECT pg_catalog.setval('dbo."TenantRentBooking_TenantRentBookingId_seq"', 1, true);
          dbo          postgres    false    231            �           0    0 ,   TenantRentContracts_TenantRentContractId_seq    SEQUENCE SET     Z   SELECT pg_catalog.setval('dbo."TenantRentContracts_TenantRentContractId_seq"', 1, false);
          dbo          postgres    false    233            �           0    0    Users_UserId_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dbo."Users_UserId_seq"', 2, true);
          dbo          postgres    false    221            �           2606    80811    Access Access_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY dbo."Access"
    ADD CONSTRAINT "Access_pkey" PRIMARY KEY ("AccessId");
 =   ALTER TABLE ONLY dbo."Access" DROP CONSTRAINT "Access_pkey";
       dbo            postgres    false    215            �           2606    81685 $   ContractBilling ContractBilling_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY dbo."ContractBilling"
    ADD CONSTRAINT "ContractBilling_pkey" PRIMARY KEY ("ContractBillingId");
 O   ALTER TABLE ONLY dbo."ContractBilling" DROP CONSTRAINT "ContractBilling_pkey";
       dbo            postgres    false    238            �           2606    81712 $   ContractPayment ContractPayment_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY dbo."ContractPayment"
    ADD CONSTRAINT "ContractPayment_pkey" PRIMARY KEY ("ContractPaymentId");
 O   ALTER TABLE ONLY dbo."ContractPayment" DROP CONSTRAINT "ContractPayment_pkey";
       dbo            postgres    false    240            �           2606    80841     Notifications Notifications_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY dbo."Notifications"
    ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY ("NotificationId");
 K   ALTER TABLE ONLY dbo."Notifications" DROP CONSTRAINT "Notifications_pkey";
       dbo            postgres    false    217            �           2606    81665 ,   RentContractHistory RentContractHistory_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY dbo."RentContractHistory"
    ADD CONSTRAINT "RentContractHistory_pkey" PRIMARY KEY ("RentContractHistoryId");
 W   ALTER TABLE ONLY dbo."RentContractHistory" DROP CONSTRAINT "RentContractHistory_pkey";
       dbo            postgres    false    236            �           2606    81542 .   StallClassifications StallClassifications_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY dbo."StallClassifications"
    ADD CONSTRAINT "StallClassifications_pkey" PRIMARY KEY ("StallClassificationId");
 Y   ALTER TABLE ONLY dbo."StallClassifications" DROP CONSTRAINT "StallClassifications_pkey";
       dbo            postgres    false    225            �           2606    81774    StallRate StallRate_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY dbo."StallRate"
    ADD CONSTRAINT "StallRate_pkey" PRIMARY KEY ("RateCode", "StallId");
 C   ALTER TABLE ONLY dbo."StallRate" DROP CONSTRAINT "StallRate_pkey";
       dbo            postgres    false    241    241            �           2606    81553    Stalls Stalls_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY dbo."Stalls"
    ADD CONSTRAINT "Stalls_pkey" PRIMARY KEY ("StallId");
 =   ALTER TABLE ONLY dbo."Stalls" DROP CONSTRAINT "Stalls_pkey";
       dbo            postgres    false    227            �           2606    80851    SystemConfig SystemConfig_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY dbo."SystemConfig"
    ADD CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("Key");
 I   ALTER TABLE ONLY dbo."SystemConfig" DROP CONSTRAINT "SystemConfig_pkey";
       dbo            postgres    false    219            �           2606    81641 +   TenantRentContract TenantRentContracts_pkey 
   CONSTRAINT     ~   ALTER TABLE ONLY dbo."TenantRentContract"
    ADD CONSTRAINT "TenantRentContracts_pkey" PRIMARY KEY ("TenantRentContractId");
 V   ALTER TABLE ONLY dbo."TenantRentContract" DROP CONSTRAINT "TenantRentContracts_pkey";
       dbo            postgres    false    234            �           2606    81580    Files pk_files_901578250 
   CONSTRAINT     [   ALTER TABLE ONLY dbo."Files"
    ADD CONSTRAINT pk_files_901578250 PRIMARY KEY ("FileId");
 A   ALTER TABLE ONLY dbo."Files" DROP CONSTRAINT pk_files_901578250;
       dbo            postgres    false    229            �           2606    81524 8   GatewayConnectedUsers pk_gatewayconnectedusers_933578364 
   CONSTRAINT     w   ALTER TABLE ONLY dbo."GatewayConnectedUsers"
    ADD CONSTRAINT pk_gatewayconnectedusers_933578364 PRIMARY KEY ("Id");
 a   ALTER TABLE ONLY dbo."GatewayConnectedUsers" DROP CONSTRAINT pk_gatewayconnectedusers_933578364;
       dbo            postgres    false    223            �           2606    81585 -   UserProfilePic pk_userprofilepic_1_1525580473 
   CONSTRAINT     p   ALTER TABLE ONLY dbo."UserProfilePic"
    ADD CONSTRAINT pk_userprofilepic_1_1525580473 PRIMARY KEY ("UserId");
 V   ALTER TABLE ONLY dbo."UserProfilePic" DROP CONSTRAINT pk_userprofilepic_1_1525580473;
       dbo            postgres    false    230            �           2606    80857    Users pk_users_1557580587 
   CONSTRAINT     \   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT pk_users_1557580587 PRIMARY KEY ("UserId");
 B   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT pk_users_1557580587;
       dbo            postgres    false    220            �           1259    81561    u_stall    INDEX     �   CREATE UNIQUE INDEX u_stall ON dbo."Stalls" USING btree ("Name", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_stall;
       dbo            postgres    false    227    227    227            �           1259    81562    u_stallcode    INDEX     �   CREATE UNIQUE INDEX u_stallcode ON dbo."Stalls" USING btree ("StallCode", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_stallcode;
       dbo            postgres    false    227    227    227            �           1259    81782    u_stallrate_stall    INDEX        CREATE UNIQUE INDEX u_stallrate_stall ON dbo."StallRate" USING btree ("StallId", "RateCode") WITH (deduplicate_items='false');
 "   DROP INDEX dbo.u_stallrate_stall;
       dbo            postgres    false    241    241            �           1259    80868    u_user_number    INDEX     �   CREATE UNIQUE INDEX u_user_number ON dbo."Users" USING btree ("MobileNumber", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_user_number;
       dbo            postgres    false    220    220    220            �           1259    81563 
   u_username    INDEX     �   CREATE UNIQUE INDEX u_username ON dbo."Users" USING btree ("UserName", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_username;
       dbo            postgres    false    220    220    220            �           2606    81525 3   GatewayConnectedUsers fk_GatewayConnectedUsers_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GatewayConnectedUsers"
    ADD CONSTRAINT "fk_GatewayConnectedUsers_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 ^   ALTER TABLE ONLY dbo."GatewayConnectedUsers" DROP CONSTRAINT "fk_GatewayConnectedUsers_User";
       dbo          postgres    false    3292    223    220            �           2606    80876    Users fk_User_Access    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT "fk_User_Access" FOREIGN KEY ("AccessId") REFERENCES dbo."Access"("AccessId") NOT VALID;
 ?   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT "fk_User_Access";
       dbo          postgres    false    3286    220    215                       2606    81696 4   ContractBilling fk_contractbilling_assigmedcollector    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."ContractBilling"
    ADD CONSTRAINT fk_contractbilling_assigmedcollector FOREIGN KEY ("AssignedCollectorId") REFERENCES dbo."Users"("UserId");
 ]   ALTER TABLE ONLY dbo."ContractBilling" DROP CONSTRAINT fk_contractbilling_assigmedcollector;
       dbo          postgres    false    220    238    3292                       2606    81691 5   ContractBilling fk_contractbilling_tenantrentcontract    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."ContractBilling"
    ADD CONSTRAINT fk_contractbilling_tenantrentcontract FOREIGN KEY ("TenantRentContractId") REFERENCES dbo."TenantRentContract"("TenantRentContractId");
 ^   ALTER TABLE ONLY dbo."ContractBilling" DROP CONSTRAINT fk_contractbilling_tenantrentcontract;
       dbo          postgres    false    238    3308    234                       2606    81686 '   ContractBilling fk_contractbilling_user    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."ContractBilling"
    ADD CONSTRAINT fk_contractbilling_user FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 P   ALTER TABLE ONLY dbo."ContractBilling" DROP CONSTRAINT fk_contractbilling_user;
       dbo          postgres    false    238    220    3292                       2606    81713 2   ContractPayment fk_contractpayment_contractbilling    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."ContractPayment"
    ADD CONSTRAINT fk_contractpayment_contractbilling FOREIGN KEY ("ContractBillingId") REFERENCES dbo."ContractBilling"("ContractBillingId");
 [   ALTER TABLE ONLY dbo."ContractPayment" DROP CONSTRAINT fk_contractpayment_contractbilling;
       dbo          postgres    false    3312    238    240                       2606    81718 '   ContractPayment fk_contractpayment_user    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."ContractPayment"
    ADD CONSTRAINT fk_contractpayment_user FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 P   ALTER TABLE ONLY dbo."ContractPayment" DROP CONSTRAINT fk_contractpayment_user;
       dbo          postgres    false    240    3292    220            �           2606    81031 #   Notifications fk_notifications_user    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Notifications"
    ADD CONSTRAINT fk_notifications_user FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId") NOT VALID;
 L   ALTER TABLE ONLY dbo."Notifications" DROP CONSTRAINT fk_notifications_user;
       dbo          postgres    false    220    217    3292                       2606    81666 =   RentContractHistory fk_rentcontracthistory_tenantrentcontract    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."RentContractHistory"
    ADD CONSTRAINT fk_rentcontracthistory_tenantrentcontract FOREIGN KEY ("TenantRentContractId") REFERENCES dbo."TenantRentContract"("TenantRentContractId");
 f   ALTER TABLE ONLY dbo."RentContractHistory" DROP CONSTRAINT fk_rentcontracthistory_tenantrentcontract;
       dbo          postgres    false    236    3308    234            �           2606    81554 #   Stalls fk_stall_stallclassification    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Stalls"
    ADD CONSTRAINT fk_stall_stallclassification FOREIGN KEY ("StallClassificationId") REFERENCES dbo."StallClassifications"("StallClassificationId");
 L   ALTER TABLE ONLY dbo."Stalls" DROP CONSTRAINT fk_stall_stallclassification;
       dbo          postgres    false    225    227    3298            �           2606    81596 9   StallClassifications fk_stallclassification_thumbnailfile    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."StallClassifications"
    ADD CONSTRAINT fk_stallclassification_thumbnailfile FOREIGN KEY ("thumbnailFileId") REFERENCES dbo."Files"("FileId") NOT VALID;
 b   ALTER TABLE ONLY dbo."StallClassifications" DROP CONSTRAINT fk_stallclassification_thumbnailfile;
       dbo          postgres    false    229    3304    225                       2606    81775    StallRate fk_stallrate_stall    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."StallRate"
    ADD CONSTRAINT fk_stallrate_stall FOREIGN KEY ("StallId") REFERENCES dbo."Stalls"("StallId");
 E   ALTER TABLE ONLY dbo."StallRate" DROP CONSTRAINT fk_stallrate_stall;
       dbo          postgres    false    3300    241    227            �           2606    81615 ,   TenantRentBooking fk_tenantrentbooking_stall    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."TenantRentBooking"
    ADD CONSTRAINT fk_tenantrentbooking_stall FOREIGN KEY ("StallId") REFERENCES dbo."Stalls"("StallId");
 U   ALTER TABLE ONLY dbo."TenantRentBooking" DROP CONSTRAINT fk_tenantrentbooking_stall;
       dbo          postgres    false    3300    232    227            �           2606    81642 -   TenantRentContract fk_tenantrentbooking_stall    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."TenantRentContract"
    ADD CONSTRAINT fk_tenantrentbooking_stall FOREIGN KEY ("StallId") REFERENCES dbo."Stalls"("StallId");
 V   ALTER TABLE ONLY dbo."TenantRentContract" DROP CONSTRAINT fk_tenantrentbooking_stall;
       dbo          postgres    false    3300    234    227            �           2606    81610 +   TenantRentBooking fk_tenantrentbooking_user    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."TenantRentBooking"
    ADD CONSTRAINT fk_tenantrentbooking_user FOREIGN KEY ("RequestedByUserId") REFERENCES dbo."Users"("UserId");
 T   ALTER TABLE ONLY dbo."TenantRentBooking" DROP CONSTRAINT fk_tenantrentbooking_user;
       dbo          postgres    false    3292    232    220                        2606    81647 ,   TenantRentContract fk_tenantrentbooking_user    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."TenantRentContract"
    ADD CONSTRAINT fk_tenantrentbooking_user FOREIGN KEY ("TenantUserId") REFERENCES dbo."Users"("UserId");
 U   ALTER TABLE ONLY dbo."TenantRentContract" DROP CONSTRAINT fk_tenantrentbooking_user;
       dbo          postgres    false    220    3292    234            �           2606    81586 0   UserProfilePic fk_userprofilepic_files_354100302    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."UserProfilePic"
    ADD CONSTRAINT fk_userprofilepic_files_354100302 FOREIGN KEY ("FileId") REFERENCES dbo."Files"("FileId");
 Y   ALTER TABLE ONLY dbo."UserProfilePic" DROP CONSTRAINT fk_userprofilepic_files_354100302;
       dbo          postgres    false    230    3304    229            �           2606    81591 &   UserProfilePic fk_userprofilepic_users    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."UserProfilePic"
    ADD CONSTRAINT fk_userprofilepic_users FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 O   ALTER TABLE ONLY dbo."UserProfilePic" DROP CONSTRAINT fk_userprofilepic_users;
       dbo          postgres    false    230    3292    220            �   �   x�3�tL���㌎�S �jCAA� 1=U�JA�%�8#)?�(EII�,3�([RT��,�����V�E�(3=��(���gmHj^b^�BP*�p�����K���Ksr��N����̴��Ē��<:;!�8���V:&'�S�N#���� �b���� �ü      �      x������ � �      �      x������ � �      �   �  x�ŖǮ�:���{���X9`�R+�B+�fC��Vn���:���YxcH�XſP�T��2��Q��bI|!��0)�^ ŒX�Pl��}[|)繟����4w#(����
����>�����&�/� ��Y{���������I ��*�0W];}�U�K?�$ɦII�՘�`�. }U�6�9ɪ����D*��(�l\�$Iҽ۟I�u����J�8�2$� 9Uт�=f?������qMq5`���n�X�7��|�DIf�s"��2C�N�Č*W��{6�['�+��E/�7��#�{��/.\>bګ�������Y���m�޺Im�)b����\%6%���d��d� ˈռ�#*���ːx�a����%���yW�����;y��T���1�dRI�����O����ȯ�{o�y�$��r�S����5�ڕ�zUz����CuL<v�]�{f��� �fh&Se?��ۯ���I��
^-�C��x�	��E�D�7\8����'�&��S�B���$C.,��(�� %�����}�f+������pf�LlX缛�Y�s:�!M�_��4��iyQ���Չ���ΕVlV�c��a�q�c���	y�8#wjs�S�q������EP����P��)&T�z�;�����ܤ��ntc��J��"(X�r)}��S�hw���� Q�>ˉ�g�1��7.�&�B;��:���P���;«\ʳ�ܨ�l�2y0�w�%kX	SAe���֙y�-_�;�K*�.��Ƿy�w�.ۭ;��b��.�mYe8��@V*��pCA<�%��,�2����I��@��%Or<�@�$4���U�?ex�,:9���9,�����0�����'X��4@����	��WDXhuߜ��oB �,�*Y1g�ba�/z���Vڱ-�M��K})����Qʅ��ί�~��و�=���qnm'Vp�������w/�0[7��J ��Q�isS"��R�r=��.ZtI[S���\�KVr�"�`��2�1�}�RI}���~�u}�0`ޒ�3c"^������>cK��"����S���Y<�qz"�}������s3G7��wu8n��d�Y�����K� �K�B�uRA��璍32f2��_��#(�pvo���_a�v�ɛ���2<�O���gYG�G���jϋ�H�N"O��e���ښkFĮh�G����H_r"���h�d�8�Ev3��qm�jRڂ;�=-��7��������A�$�m�AQ�ԈVp/�U��PW�Ap�UD�W�6��V��İh=G���Y�;	����Lz�֭�^��vQ���~��*~{��m��>�3|��\L"$3�}4�:�W Y�>�������)9���f$pE3�p۝�2,Ve5g���������A�?_�~���k�      �      x������ � �      �      x������ � �      �      x������ � �      �   �   x�m�1�@��9��K�$w���B']]��D����EZ��fz	<������5�ח������+�����6T�AȺzG5tG`�i�����Լ̕/�/�H3�4 �O��x��U �Ln����)�:.j���J��;��_�tC�      �      x������ � �      �   e   x�ı
�0���+�K侇u��b@\���D1����g8�-^�����0v�;�I �%���<�χ޷�	J-,Ūdt�����Z_�0>�� ͜c��%6      �      x������ � �      �   >   x�3�4 CN#N 602�50�52T00�22�22ѳ47�6����C��p�s��s����� �'J      �      x������ � �      �      x������ � �      �   �   x�U�MS�0�ϛ_�+mB!�8IZ#�رN/�%h���z��wf��3�>�}�ڀG��^ڙ�wU�n�0s�Y;�����^��u�UJ)���Vu���I F��2R-�p�8�I�,��	ȰxF��Z#z�����b�:�M�,�YuP<K�Ê�a�k���4�O7�Gn�a���q�t���s�'RS�c�S����s���UF�6���0E�     