#!/usr/bin/python3

######################################################################################################
## IMPORTACIÓNS
######################################################################################################
from __future__ import absolute_import
from __future__ import print_function
from __future__ import unicode_literals

import pathlib
import subprocess
import sys
import os
import re
import ast

######################################################################################################
## VARIABLES GLOBAIS
######################################################################################################
command_pre_tests   = [['clear'], ['npm', 'cache', 'clean', '--force']]
command_tests       = ['npm', 'run', 'test', '--']

test_dir    = 'test/services/'
file_name   = './tests.log'

suites      = { "passed": [], "total": [] }
tests       = { "passed": [], "total": [] }
snapshots   = []
times       = { "total": [], "estimated": [] }

######################################################################################################
## FUNCIÓNS FICHEIROS
######################################################################################################
def create_file():
    """Crea o ficheiro para gardar os logs."""
    os.makedirs(os.path.dirname(file_name), exist_ok = True)

    with open(file_name, 'w+', encoding='utf-8') as f:
        f.write('')
        f.close()

def save_file(data, write_first_line = False, new_file = False):
    """Garda a información de cada test no ficheiro.

    :param name     : nome do ficheiro dos test
    :param info     : información básica dos test
    :param resume   : resumo entregado por jest
    :param new_file : indica se se debe borrar o ficherio de destino (por defecto non)
    """
    origin_file = []
    open_file_mode = 'a+'

    if (new_file):
        create_file()

    if (write_first_line):
        # Gárdase o contido do fichiero nunha variable
        with open(file_name, 'r', encoding='utf-8') as f:
            origin_file = f.read()

        # Cámbiase o modo de apertura do ficheiro para sobreescribilo
        open_file_mode = 'w+'

    # Escríbese a información no ficheiro
    with open(file_name, open_file_mode, encoding='utf-8') as f:
        f.writelines(data)
        f.write('\n')

        # Escríbese o contido anterior do ficheiro
        if (write_first_line):
            f.write('\n')
            f.writelines(origin_file)

######################################################################################################
## FUNCIÓNS TESTS
######################################################################################################
def pre_test():
    """Executa uns proceso opcionais antes dos tests."""
    for pre_test in command_pre_tests:
        result = subprocess.run(
            pre_test
        )

    create_file()

def test():
    """Recore o directorio onde se gardan os tests e executaos."""
    global suites
    global tests
    global snapshots
    global times

    test_names = pathlib.Path(test_dir)

    for subdir in test_names.iterdir():
        for test in subdir.iterdir():
            temp_command = command_tests + [test.name, '--forceExit']
            proc = subprocess.run(
                temp_command,
                capture_output=True,
                encoding='UTF-8'
            )

            # Actualízase o resumo dos tests
            sum_resume(proc.stderr)

            # Preparase a información a gardar
            data = build_report('Inicanado tests de:', test.name, proc.stdout, proc.stderr)

            # Imprimese por pantalla o resultado
            print(data)

            # Gárdase a información no ficheiro de log
            save_file(data)
            contar += 1

def build_resume():
    """Xera o resumo dos tests.

    :return : string
    """
    result = ''
    result += 'Test Suites  : {0:>10} passed, {1:>4} passed\n'.format(sum(suites["passed"]), sum(suites["total"]))
    result += 'Tests        : {0:>10} passed, {1:>4} passed\n'.format(sum(tests["passed"]), sum(tests["total"]))
    result += 'Snapshots    : {0:>10} total\n'.format(sum(snapshots))
    result += 'Time         : {0:>10} s, estimated {1} s\n'.format(sum(times["total"]), sum(times["estimated"]))

    return result

def build_report(title_report, name, info, resume):
    """Xera o resumo dos tests.

    :return : string
    """
    separator = '-' * 80
    title = '{0} {1}'.format(title_report, name)

    result = '{0}'.format(separator)
    result += '\n{0}'.format(title)
    result += '\n{0}'.format(separator)
    result += '\n'
    result += '{0}'.format(info)
    result += '\n'
    result += '{0}'.format(resume)

    return result

######################################################################################################
## UTILIDADES
######################################################################################################
def sum_resume(resume):
    """Acumula os datos do resumo pasado nas variables globais."""
    global suites
    global tests
    global snapshots
    global times

    suites_text     = re.findall('Test Suites:(.*?)\n', resume)
    tests_text      = re.findall('Tests:(.*?)\n', resume)
    snapshots_text  = re.findall('Snapshots:(.*?)\n', resume)
    time_text       = re.findall('Time:(.*?)\n', resume)

    for item in suites_text:
        temp = extract_numbers_2_list(item)

        suites["passed"].append(temp[0])
        suites["total"].append(temp[1])

    for item in tests_text:
        temp = extract_numbers_2_list(item)

        tests["passed"].append(temp[0])
        tests["total"].append(temp[1])

    for item in snapshots_text:
        temp = extract_numbers_2_list(item)

        snapshots += temp

    for item in time_text:
        temp = extract_numbers_2_list(item)

        times["total"].append(temp[0])
        if (len(temp) == 2):
            times["estimated"].append(temp[1])

def extract_numbers_2_list(text):
    """Saca os números dun texto a unha lista de números.

    :return : lista de números
    """
    temp = re.findall(r'(\d+(?:\.\d+)?)', text)

    return str_list_2_number(temp)

def str_list_2_number(str_array):
    """Parsea un string cun número a un tipo numérico

    :return : lista de números
    """

    return [ast.literal_eval(s) for s in str_array]

######################################################################################################
## FUNCIÓN PRINCIPAL
######################################################################################################
def main():
    """Función principal."""
    global suites
    global tests
    global snapshots
    global times

    pre_test()
    test()

    # Preparase a información a gardar
    data = build_report('Resumo global:', '', '', build_resume())

    # Gárdase a información no inicio do ficheiro de log
    save_file(data, True)

######################################################################################################
## ARRANQUE
######################################################################################################
if __name__ == '__main__':
    main()

