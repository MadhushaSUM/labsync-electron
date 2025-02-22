PGDMP  0                     }            labsync_desktop    16.6    16.6 5               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16511    labsync_desktop    DATABASE     �   CREATE DATABASE labsync_desktop WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE labsync_desktop;
                postgres    false                       0    0    SCHEMA public    ACL     (   GRANT ALL ON SCHEMA public TO madhusha;
                   pg_database_owner    false    5            �            1259    16512    configs    TABLE     y   CREATE TABLE public.configs (
    id bigint NOT NULL,
    description text NOT NULL,
    configuration jsonb NOT NULL
);
    DROP TABLE public.configs;
       public         heap    madhusha    false            �            1259    16517    configs_id_seq    SEQUENCE     �   ALTER TABLE public.configs ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.configs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          madhusha    false    215            �            1259    16518    doctors    TABLE     P   CREATE TABLE public.doctors (
    id bigint NOT NULL,
    name text NOT NULL
);
    DROP TABLE public.doctors;
       public         heap    madhusha    false            �            1259    16523    doctors_id_seq    SEQUENCE     �   ALTER TABLE public.doctors ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.doctors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          madhusha    false    217            �            1259    16524    normal_ranges    TABLE     �   CREATE TABLE public.normal_ranges (
    test_field_id bigint NOT NULL,
    test_id bigint NOT NULL,
    rules jsonb DEFAULT '[]'::jsonb NOT NULL
);
 !   DROP TABLE public.normal_ranges;
       public         heap    madhusha    false            �            1259    16530    patients    TABLE     �   CREATE TABLE public.patients (
    id bigint NOT NULL,
    name text NOT NULL,
    gender text NOT NULL,
    date_of_birth date NOT NULL,
    contact_number text
);
    DROP TABLE public.patients;
       public         heap    madhusha    false            �            1259    16535    patients_id_seq    SEQUENCE     �   ALTER TABLE public.patients ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.patients_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          madhusha    false    220            �            1259    16536    test_fields    TABLE     q   CREATE TABLE public.test_fields (
    id bigint NOT NULL,
    test_id bigint NOT NULL,
    name text NOT NULL
);
    DROP TABLE public.test_fields;
       public         heap    madhusha    false            �            1259    16541    test_fields_id_seq    SEQUENCE     �   ALTER TABLE public.test_fields ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.test_fields_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          madhusha    false    222            �            1259    16542    test_register    TABLE        CREATE TABLE public.test_register (
    id bigint NOT NULL,
    date date NOT NULL,
    patient_id bigint NOT NULL,
    ref_number bigint,
    total_cost double precision NOT NULL,
    paid_price double precision DEFAULT 0 NOT NULL,
    report_collected boolean DEFAULT false NOT NULL
);
 !   DROP TABLE public.test_register;
       public         heap    madhusha    false            �            1259    16547    test_register_id_seq    SEQUENCE     �   ALTER TABLE public.test_register ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.test_register_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          madhusha    false    224            �            1259    16548    test_register_tests    TABLE        CREATE TABLE public.test_register_tests (
    test_register_id bigint NOT NULL,
    test_id bigint NOT NULL,
    doctor_id bigint,
    data jsonb,
    data_added boolean DEFAULT false NOT NULL,
    printed boolean DEFAULT false NOT NULL,
    options jsonb DEFAULT '{}'::jsonb NOT NULL
);
 '   DROP TABLE public.test_register_tests;
       public         heap    madhusha    false            �            1259    16556    tests    TABLE     �   CREATE TABLE public.tests (
    id bigint NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    price double precision DEFAULT 0.0 NOT NULL
);
    DROP TABLE public.tests;
       public         heap    madhusha    false            �            1259    16562    tests_id_seq    SEQUENCE     �   ALTER TABLE public.tests ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          madhusha    false    227            �            1259    16563    users    TABLE     �   CREATE TABLE public.users (
    id bigint NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'user'::text NOT NULL
);
    DROP TABLE public.users;
       public         heap    madhusha    false            �            1259    16569    users_id_seq    SEQUENCE     �   ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          madhusha    false    229            �          0    16512    configs 
   TABLE DATA           A   COPY public.configs (id, description, configuration) FROM stdin;
    public          madhusha    false    215   �>       �          0    16518    doctors 
   TABLE DATA           +   COPY public.doctors (id, name) FROM stdin;
    public          madhusha    false    217   F?       �          0    16524    normal_ranges 
   TABLE DATA           F   COPY public.normal_ranges (test_field_id, test_id, rules) FROM stdin;
    public          madhusha    false    219   c?       �          0    16530    patients 
   TABLE DATA           S   COPY public.patients (id, name, gender, date_of_birth, contact_number) FROM stdin;
    public          madhusha    false    220   �B       �          0    16536    test_fields 
   TABLE DATA           8   COPY public.test_fields (id, test_id, name) FROM stdin;
    public          madhusha    false    222   �B       �          0    16542    test_register 
   TABLE DATA           s   COPY public.test_register (id, date, patient_id, ref_number, total_cost, paid_price, report_collected) FROM stdin;
    public          madhusha    false    224   CE       �          0    16548    test_register_tests 
   TABLE DATA           w   COPY public.test_register_tests (test_register_id, test_id, doctor_id, data, data_added, printed, options) FROM stdin;
    public          madhusha    false    226   `E       �          0    16556    tests 
   TABLE DATA           6   COPY public.tests (id, code, name, price) FROM stdin;
    public          madhusha    false    227   }E       �          0    16563    users 
   TABLE DATA           =   COPY public.users (id, username, password, role) FROM stdin;
    public          madhusha    false    229   H                  0    0    configs_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.configs_id_seq', 2, true);
          public          madhusha    false    216                       0    0    doctors_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.doctors_id_seq', 4, true);
          public          madhusha    false    218            	           0    0    patients_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.patients_id_seq', 8, true);
          public          madhusha    false    221            
           0    0    test_fields_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.test_fields_id_seq', 74, true);
          public          madhusha    false    223                       0    0    test_register_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.test_register_id_seq', 19, true);
          public          madhusha    false    225                       0    0    tests_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.tests_id_seq', 35, true);
          public          madhusha    false    228                       0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 2, true);
          public          madhusha    false    230            I           2606    16571    configs configs_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.configs
    ADD CONSTRAINT configs_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.configs DROP CONSTRAINT configs_pkey;
       public            madhusha    false    215            K           2606    16573    doctors doctors_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.doctors DROP CONSTRAINT doctors_pkey;
       public            madhusha    false    217            M           2606    16575     normal_ranges normal_ranges_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.normal_ranges
    ADD CONSTRAINT normal_ranges_pkey PRIMARY KEY (test_field_id, test_id);
 J   ALTER TABLE ONLY public.normal_ranges DROP CONSTRAINT normal_ranges_pkey;
       public            madhusha    false    219    219            O           2606    16577    patients patients_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.patients DROP CONSTRAINT patients_pkey;
       public            madhusha    false    220            Q           2606    16579    test_fields test_fields_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.test_fields
    ADD CONSTRAINT test_fields_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.test_fields DROP CONSTRAINT test_fields_pkey;
       public            madhusha    false    222            S           2606    16581     test_register test_register_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.test_register
    ADD CONSTRAINT test_register_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.test_register DROP CONSTRAINT test_register_pkey;
       public            madhusha    false    224            U           2606    16583 ,   test_register_tests test_register_tests_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.test_register_tests
    ADD CONSTRAINT test_register_tests_pkey PRIMARY KEY (test_register_id, test_id);
 V   ALTER TABLE ONLY public.test_register_tests DROP CONSTRAINT test_register_tests_pkey;
       public            madhusha    false    226    226            W           2606    16585    tests tests_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.tests
    ADD CONSTRAINT tests_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.tests DROP CONSTRAINT tests_pkey;
       public            madhusha    false    227            Y           2606    16587    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            madhusha    false    229            Z           2606    16588 -   normal_ranges normal_range_test_field_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.normal_ranges
    ADD CONSTRAINT normal_range_test_field_id_fkey FOREIGN KEY (test_field_id) REFERENCES public.test_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;
 W   ALTER TABLE ONLY public.normal_ranges DROP CONSTRAINT normal_range_test_field_id_fkey;
       public          madhusha    false    219    222    4689            [           2606    16593 '   normal_ranges normal_range_test_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.normal_ranges
    ADD CONSTRAINT normal_range_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id) ON UPDATE CASCADE ON DELETE CASCADE;
 Q   ALTER TABLE ONLY public.normal_ranges DROP CONSTRAINT normal_range_test_id_fkey;
       public          madhusha    false    219    4695    227            \           2606    16598    test_fields test_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.test_fields
    ADD CONSTRAINT test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id) ON UPDATE CASCADE ON DELETE CASCADE;
 B   ALTER TABLE ONLY public.test_fields DROP CONSTRAINT test_id_fkey;
       public          madhusha    false    227    222    4695            ]           2606    16603 +   test_register test_register_patient_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.test_register
    ADD CONSTRAINT test_register_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON UPDATE CASCADE ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.test_register DROP CONSTRAINT test_register_patient_id_fkey;
       public          madhusha    false    224    4687    220            ^           2606    16608 6   test_register_tests test_register_tests_doctor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.test_register_tests
    ADD CONSTRAINT test_register_tests_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON UPDATE CASCADE ON DELETE CASCADE;
 `   ALTER TABLE ONLY public.test_register_tests DROP CONSTRAINT test_register_tests_doctor_id_fkey;
       public          madhusha    false    217    4683    226            _           2606    16613 4   test_register_tests test_register_tests_test_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.test_register_tests
    ADD CONSTRAINT test_register_tests_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id) ON UPDATE CASCADE ON DELETE CASCADE;
 ^   ALTER TABLE ONLY public.test_register_tests DROP CONSTRAINT test_register_tests_test_id_fkey;
       public          madhusha    false    4695    226    227            `           2606    16618 =   test_register_tests test_register_tests_test_register_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.test_register_tests
    ADD CONSTRAINT test_register_tests_test_register_id_fkey FOREIGN KEY (test_register_id) REFERENCES public.test_register(id) ON UPDATE CASCADE ON DELETE CASCADE;
 g   ALTER TABLE ONLY public.test_register_tests DROP CONSTRAINT test_register_tests_test_register_id_fkey;
       public          madhusha    false    226    224    4691            �   p   x�3�,(JMK-*JMQHLOUH�/�M,�Vr�!%+�h���Ģb��Z.C��̼�Ԣb���Ԃ���x�P��ofrQ~q~Z�B HP�$_!��MIG�695��ŵ\1z\\\ j�4Q      �      x������ � �      �   &  x��ZKn�0]ӧ0�r�U�U���J�0�]�ci� �z���'�R�ZC�6`*��iY�{�μ�0���vw��C�n}�|��t�źy���O�_�+\m�݇��F�����҅o�w�������
�� \-D5F�	��J�'?^�� ��b}��a�?]Kj��� ��e2 6.a:��Ӯ�k���n�aN���\Ln�ϧ��?�V�	c��*V��&���JF@-DKBA#��8�"�#⅊;�Eċ3�/y�-�-%a&=K����Ow2�Sę��:8�@NFHܡ^�F�*eU]1�٦���AjG��K���Y��b.7$ՙ|x��bO��������(u�U٨��T���s��2�ּ���x)ݔ'��C�jtC#�W�FhÔ4H� sf��df�-c�vz��*�QcUT�%�,r�"*P��I��&*qj��C�R-'zj�أ�����5Q���(v�ͦ�I��ӣO1���ٌ/�L|�3�7ا˘�/�vX8l��ɽgs@��5V���?�1eZ��]��,�U�h|�:��o�K8�fk��Đ4��i-_ƅAsV9�/e:��&����<�2�%=Q�*`�2�����p��})�%aM��D8������6��Ŭ<�>7���@�ɓE��Y�{"@-,�p�7��1�%5����:�D��|�RN��	������p�m�2Ο��WV�bj��Z8�3ZMI�?	�\%�uJ.�i@5�YX��s\L7f�R���V�G�8O�O��ƿ����N��m*�����
��ߔ|����v���      �   A   x����-�SN��,�HщE�y���٩���9���������F��ږ&��F�@d����� .��      �   I  x�u�Mӛ ����tD����9���=��H"S0���w7��$>���W�}���C�5fVFr�W��1�98;��D��9So�9�@e���%���K�P����m�x�4GGy��X}��Պ/��j��B3`.=�R��tJ �;�&(�BD�0lh�{o��A9k�T���ќ�r�K1*�}��_�`V�<ᴪP!{�����rR�:8#�(���������Y��Ŝ�)T�o�U��K��
�K���K�X�����"|��	4��_�[����֍�z"�ȵ�?�=*�'|�����,c[�镴c��s��.N��p��d�Z�=DB�'��|N����j����b��?�ѣ��6��.�j��|{^��i�dx�*���.ַ?�J�i33��C�-("\���X~a�04_��Ȯ&�ݩ&��1,_FZcm��a��jx��c��Sx��|� E��j�"C郂�y�V{���e���RpFҗa��(J4A};�oҔ�zIӤ�
)��ީ��X�4we����������m#�	,�{I�dpIF;�V�Lɯ��~d~�l6�zf�)      �      x������ � �      �      x������ � �      �   {  x�eSKs�0>�����1��cLb����5��t�BMb�H'��+�ۜ�����o?b��NJRJ�*�,ċ�l	R��*z�.Brx��<��w��E��ŷмWz�^�=$s�(���J�EgB8��w�*?��c2@hJ8�!^/f�P�vÇXn��;hX=�y�'�t>/�0*�p-d\��$����.9�Z�l5�<]C!o7�������}��͛!��\i�w��n�I�$��i�+d��PӶ�i��4�^�(O����Јw8>�r�����li�7�v18OQa\M���-«8PcEW���a�J!�v��Ʊ��~(߁�X�;���:���H�{�;2��Q&��ts@(熻�Z�Jrs>�'\��T�tL^XdJӎqxE���R)Q�8���-d�k~�����<d���K>�\.�Q]	�
<t�:��"�,���z�����������n=�;��SE�[�7����9mU-RI"nݣvQVx<�$����pܠ�m�b(X��J����"�g�6��G(��U�2}C-5SKDqP�u(���GA���=R�ʯ�؀Ɯ3�U�O��uAi&��7�f�e���A_�lu�����l�7�qi      �   "   x�3�LL����4��\F��ũE��+F��� �	I     