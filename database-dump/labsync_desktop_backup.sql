PGDMP      4                 }            labsync_desktop    16.6    16.6                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16511    labsync_desktop    DATABASE     �   CREATE DATABASE labsync_desktop WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE labsync_desktop;
                postgres    false            �          0    16512    configs 
   TABLE DATA           A   COPY public.configs (id, description, configuration) FROM stdin;
    public          madhusha    false    215   �       �          0    16518    doctors 
   TABLE DATA           +   COPY public.doctors (id, name) FROM stdin;
    public          madhusha    false    217          �          0    16524    normal_ranges 
   TABLE DATA           F   COPY public.normal_ranges (test_field_id, test_id, rules) FROM stdin;
    public          madhusha    false    219   7       �          0    16530    patients 
   TABLE DATA           S   COPY public.patients (id, name, gender, date_of_birth, contact_number) FROM stdin;
    public          madhusha    false    220   m       �          0    16536    test_fields 
   TABLE DATA           8   COPY public.test_fields (id, test_id, name) FROM stdin;
    public          madhusha    false    222   �       �          0    16542    test_register 
   TABLE DATA           s   COPY public.test_register (id, date, patient_id, ref_number, total_cost, paid_price, report_collected) FROM stdin;
    public          madhusha    false    224   �       �          0    16548    test_register_tests 
   TABLE DATA           w   COPY public.test_register_tests (test_register_id, test_id, doctor_id, data, data_added, printed, options) FROM stdin;
    public          madhusha    false    226           �          0    16556    tests 
   TABLE DATA           6   COPY public.tests (id, code, name, price) FROM stdin;
    public          madhusha    false    227          �          0    16563    users 
   TABLE DATA           =   COPY public.users (id, username, password, role) FROM stdin;
    public          madhusha    false    229   �                  0    0    configs_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.configs_id_seq', 2, true);
          public          madhusha    false    216                       0    0    doctors_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.doctors_id_seq', 4, true);
          public          madhusha    false    218            	           0    0    patients_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.patients_id_seq', 7, true);
          public          madhusha    false    221            
           0    0    test_fields_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.test_fields_id_seq', 74, true);
          public          madhusha    false    223                       0    0    test_register_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.test_register_id_seq', 18, true);
          public          madhusha    false    225                       0    0    tests_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.tests_id_seq', 35, true);
          public          madhusha    false    228                       0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 2, true);
          public          madhusha    false    230            �   p   x�3�,(JMK-*JMQHLOUH�/�M,�Vr�!%+�h���Ģb��Z.C��̼�Ԣb���Ԃ���x�P��ofrQ~q~Z�B HP�$_!��MIG�695��ŵ\1z\\\ j�4Q      �      x������ � �      �   &  x��ZKn�0]ӧ0�r�U�U���J�0�]�ci� �z���'�R�ZC�6`*��iY�{�μ�0���vw��C�n}�|��t�źy���O�_�+\m�݇��F�����҅o�w�������
�� \-D5F�	��J�'?^�� ��b}��a�?]Kj��� ��e2 6.a:��Ӯ�k���n�aN���\Ln�ϧ��?�V�	c��*V��&���JF@-DKBA#��8�"�#⅊;�Eċ3�/y�-�-%a&=K����Ow2�Sę��:8�@NFHܡ^�F�*eU]1�٦���AjG��K���Y��b.7$ՙ|x��bO��������(u�U٨��T���s��2�ּ���x)ݔ'��C�jtC#�W�FhÔ4H� sf��df�-c�vz��*�QcUT�%�,r�"*P��I��&*qj��C�R-'zj�أ�����5Q���(v�ͦ�I��ӣO1���ٌ/�L|�3�7ا˘�/�vX8l��ɽgs@��5V���?�1eZ��]��,�U�h|�:��o�K8�fk��Đ4��i-_ƅAsV9�/e:��&����<�2�%=Q�*`�2�����p��})�%aM��D8������6��Ŭ<�>7���@�ɓE��Y�{"@-,�p�7��1�%5����:�D��|�RN��	������p�m�2Ο��WV�bj��Z8�3ZMI�?	�\%�uJ.�i@5�YX��s\L7f�R���V�G�8O�O��ƿ����N��m*�����
��ߔ|����v���      �      x������ � �      �   I  x�u�Mӛ ����tD����9���=��H"S0���w7��$>���W�}���C�5fVFr�W��1�98;��D��9So�9�@e���%���K�P����m�x�4GGy��X}��Պ/��j��B3`.=�R��tJ �;�&(�BD�0lh�{o��A9k�T���ќ�r�K1*�}��_�`V�<ᴪP!{�����rR�:8#�(���������Y��Ŝ�)T�o�U��K��
�K���K�X�����"|��	4��_�[����֍�z"�ȵ�?�=*�'|�����,c[�镴c��s��.N��p��d�Z�=DB�'��|N����j����b��?�ѣ��6��.�j��|{^��i�dx�*���.ַ?�J�i33��C�-("\���X~a�04_��Ȯ&�ݩ&��1,_FZcm��a��jx��c��Sx��|� E��j�"C郂�y�V{���e���RpFҗa��(J4A};�oҔ�zIӤ�
)��ީ��X�4we����������m#�	,�{I�dpIF;�V�Lɯ��~d~�l6�zf�)      �      x������ � �      �      x������ � �      �   {  x�eSKs�0>�����1��cLb����5��t�BMb�H'��+�ۜ�����o?b��NJRJ�*�,ċ�l	R��*z�.Brx��<��w��E��ŷмWz�^�=$s�(���J�EgB8��w�*?��c2@hJ8�!^/f�P�vÇXn��;hX=�y�'�t>/�0*�p-d\��$����.9�Z�l5�<]C!o7�������}��͛!��\i�w��n�I�$��i�+d��PӶ�i��4�^�(O����Јw8>�r�����li�7�v18OQa\M���-«8PcEW���a�J!�v��Ʊ��~(߁�X�;���:���H�{�;2��Q&��ts@(熻�Z�Jrs>�'\��T�tL^XdJӎqxE���R)Q�8���-d�k~�����<d���K>�\.�Q]	�
<t�:��"�,���z�����������n=�;��SE�[�7����9mU-RI"nݣvQVx<�$����pܠ�m�b(X��J����"�g�6��G(��U�2}C-5SKDqP�u(���GA���=R�ʯ�؀Ɯ3�U�O��uAi&��7�f�e���A_�lu�����l�7�qi      �   +   x�3��ML�(-�H�444�,-N-�2�LL�����\1z\\\ ��     